import { EditOutlined } from '@ant-design/icons';
import { DeleteButton, NumberField } from '@refinedev/antd';
import type { BaseKey, HttpError } from '@refinedev/core';
import {
  useGetToPath,
  useGo,
  useNavigation,
  useOne,
  useShow,
  useTranslate,
} from '@refinedev/core';
import {
  Avatar,
  Button,
  Divider,
  Flex,
  Grid,
  List,
  theme,
  Typography,
} from 'antd';
import { useSearchParams } from 'react-router-dom';

import type { ICategory, IProduct } from '../../../interfaces';
import { Drawer } from '../../drawer';
import { ProductStatus } from '../status';

type Props = {
  id?: BaseKey;
  onClose?: () => void;
  onEdit?: () => void;
};

export const ProductDrawerShow = (props: Props) => {
  const getToPath = useGetToPath();
  const [searchParameters] = useSearchParams();
  const go = useGo();
  const { editUrl } = useNavigation();
  const t = useTranslate();
  const { token } = theme.useToken();
  const breakpoint = Grid.useBreakpoint();

  const { queryResult } = useShow<IProduct, HttpError>({
    resource: 'products',
    id: props?.id, // when undefined, id will be read from the URL.
  });
  const product = queryResult.data?.data;

  const { data: categoryData } = useOne<ICategory, HttpError>({
    resource: 'categories',
    id: product?.category?.id,
    queryOptions: {
      enabled: !!product?.category?.id,
    },
  });
  const category = categoryData?.data;

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
      width={breakpoint.sm ? '378px' : '100%'}
      zIndex={1001}
      onClose={handleDrawerClose}
    >
      <Flex vertical align="center" justify="center">
        <Avatar
          shape="square"
          style={{
            aspectRatio: 1,
            objectFit: 'contain',
            width: '240px',
            height: '240px',
            margin: '16px auto',
            borderRadius: '8px',
          }}
          src={product?.images?.[0].url}
          alt={product?.images?.[0].name}
        />
      </Flex>
      <Flex
        vertical
        style={{
          backgroundColor: token.colorBgContainer,
        }}
      >
        <Flex
          vertical
          style={{
            padding: '16px',
          }}
        >
          <Typography.Title level={5}>{product?.name}</Typography.Title>
          <Typography.Text type="secondary">
            {product?.description}
          </Typography.Text>
        </Flex>
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
                  {t('products.fields.price')}
                </Typography.Text>
              ),
              value: (
                <NumberField
                  value={product?.price || 0}
                  options={{
                    style: 'currency',
                    currency: 'USD',
                  }}
                />
              ),
            },
            {
              label: (
                <Typography.Text type="secondary">
                  {t('products.fields.category')}
                </Typography.Text>
              ),
              value: <Typography.Text>{category?.title}</Typography.Text>,
            },
            {
              label: (
                <Typography.Text type="secondary">
                  {t('products.fields.isActive.label')}
                </Typography.Text>
              ),
              value: <ProductStatus value={!!product?.isActive} />,
            },
          ]}
          renderItem={(item) => {
            return (
              <List.Item>
                <List.Item.Meta
                  style={{
                    padding: '0 16px',
                  }}
                  avatar={item.label}
                  title={item.value}
                />
              </List.Item>
            );
          }}
        />
      </Flex>
      <Flex
        align="center"
        justify="space-between"
        style={{
          padding: '16px 16px 16px 0',
        }}
      >
        <DeleteButton
          type="text"
          recordItemId={product?.id}
          resource="products"
          onSuccess={() => {
            handleDrawerClose();
          }}
        />
        <Button
          icon={<EditOutlined />}
          onClick={() => {
            if (props?.onEdit) {
              props.onEdit();
            } else {
              go({
                to: `${editUrl('products', product?.id || '')}`,
                query: {
                  to: '/products',
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
      </Flex>
    </Drawer>
  );
};
