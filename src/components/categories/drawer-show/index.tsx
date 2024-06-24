import { EditOutlined } from '@ant-design/icons';
import { DeleteButton } from '@refinedev/antd';
import type { BaseKey, HttpError } from '@refinedev/core';
import {
  useGetToPath,
  useGo,
  useNavigation,
  useShow,
  useTranslate,
} from '@refinedev/core';
import { Button, Divider, Grid, List, theme, Typography } from 'antd';
import { useSearchParams } from 'react-router-dom';

import type { ICategory } from '../../../interfaces';
import { Drawer } from '../../drawer';
import { CategoryStatus } from '../status';

type Props = {
  id?: BaseKey;
  onClose?: () => void;
  onEdit?: () => void;
};

export const CategoryDrawerShow = (props: Props) => {
  const getToPath = useGetToPath();
  const [searchParameters] = useSearchParams();
  const go = useGo();
  const { editUrl } = useNavigation();
  const t = useTranslate();
  const { token } = theme.useToken();
  const breakpoint = Grid.useBreakpoint();

  const { queryResult } = useShow<ICategory, HttpError>({
    resource: 'categories',
    id: props?.id, // when undefined, id will be read from the URL.
  });
  const category = queryResult.data?.data;

  const handleDrawerClose = () => {
    if (props?.onClose) {
      props.onClose();
      return;
    }

    go({
      to:
        searchParameters.get('to') ??
        getToPath({
          action: 'list',
        }) ??
        '',
      query: {
        to: undefined,
      },
      options: {
        keepQuery: true,
      },
      type: 'replace',
    });
  };

  return (
    <Drawer
      open={true}
      width={breakpoint.sm ? '736px' : '100%'}
      zIndex={1001}
      onClose={handleDrawerClose}
    >
      {category?.images && category.images.length > 0 && (
        <div style={{ textAlign: 'center', padding: '16px' }}>
          <img
            src={category.images[0].url}
            alt={category.name}
            style={{
              maxWidth: '100%',
              maxHeight: '240px',
              objectFit: 'contain',
            }}
          />
        </div>
      )}

      <div
        style={{
          backgroundColor: token.colorBgContainer,
        }}
      >
        <div
          style={{
            padding: '16px',
          }}
        >
          <Typography.Title level={5}>{category?.name}</Typography.Title>
          <Typography.Text type="secondary">
            {category?.description}
          </Typography.Text>
        </div>
        <Divider
          style={{
            margin: 0,
            padding: 0,
          }}
        />
        <List
          dataSource={[
            {
              label: (
                <Typography.Text type="secondary">
                  {t('categories.fields.status')}
                </Typography.Text>
              ),
              value: <CategoryStatus value={category?.status ?? 0} />,
            },
            {
              label: (
                <Typography.Text type="secondary">
                  {t('categories.fields.isFeatured')}
                </Typography.Text>
              ),
              value: (
                <Typography.Text>
                  {category?.isFeatured ? t('common.yes') : t('common.no')}
                </Typography.Text>
              ),
            },
          ]}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                style={{
                  padding: '0 16px',
                }}
                avatar={item.label}
                title={item.value}
              />
            </List.Item>
          )}
        />
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 16px 16px 0',
        }}
      >
        <DeleteButton
          type="text"
          recordItemId={category?.id}
          resource="categories"
          onSuccess={handleDrawerClose}
        />
        <Button
          icon={<EditOutlined />}
          onClick={() => {
            if (props?.onEdit) {
              props.onEdit();
            } else {
              go({
                to: `${editUrl('categories', category?.id || '')}`,
                query: {
                  to: '/categories',
                },
                options: {
                  keepQuery: true,
                },
                type: 'replace',
              });
            }
          }}
        >
          {t('actions.edit')}
        </Button>
      </div>
    </Drawer>
  );
};
