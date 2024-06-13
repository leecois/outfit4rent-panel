import { EyeOutlined, TagOutlined } from '@ant-design/icons';
import { NumberField, useSimpleList } from '@refinedev/antd';
import type { HttpError } from '@refinedev/core';
import { useGo, useList, useNavigation, useTranslate } from '@refinedev/core';
import {
  Card,
  Divider,
  Flex,
  List,
  Skeleton,
  Tag,
  theme,
  Typography,
} from 'antd';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import type { ICategory, IProductList } from '../../../interfaces';
import { PaginationTotal } from '../../paginationTotal';
import { ProductStatus } from '../status';
import { useStyles } from './styled';

export const ProductListCard = () => {
  const { styles, cx } = useStyles();
  const { token } = theme.useToken();
  const t = useTranslate();
  const go = useGo();
  const { pathname } = useLocation();
  const { showUrl } = useNavigation();

  const {
    listProps: productListProps,
    filters,
    setFilters,
  } = useSimpleList<IProductList, HttpError>({
    pagination: {
      current: 1,
      pageSize: 12,
    },
    filters: {
      initial: [
        {
          field: 'category.id',
          operator: 'in',
          value: [],
        },
      ],
    },
  });

  const { data: categoryData, isLoading: categoryIsLoading } = useList<
    ICategory,
    HttpError
  >({
    resource: 'categories',
    pagination: {
      mode: 'off',
    },
  });
  const categories = categoryData?.data || [];

  const categoryFilters = useMemo(() => {
    const foundFilter = filters.find((filterItem) => {
      if ('field' in filterItem) {
        return filterItem.field === 'category.id';
      }

      return false;
    });

    const filterValues = foundFilter?.value?.map(Number);

    return {
      operator: foundFilter?.operator || 'in',
      value: (filterValues || []) as Array<number>,
    };
  }, [filters]).value;

  const hasCategoryFilter = categoryFilters?.length > 0;

  const handleOnTagClick = (categoryId: number) => {
    const newFilters = categoryFilters;
    const hasCurrentFilter = newFilters.includes(categoryId);
    if (hasCurrentFilter) {
      newFilters.splice(newFilters.indexOf(categoryId), 1);
    } else {
      newFilters.push(categoryId);
    }

    setFilters([
      {
        field: 'category.id',
        operator: 'in',
        value: newFilters,
      },
    ]);
  };

  return (
    <>
      <Divider style={{ margin: '16px 0px' }} />
      <Flex
        wrap="nowrap"
        gap={12}
        style={{
          width: '100%',
          overflowX: 'auto',
        }}
      >
        <Tag
          style={{ padding: '4px 10px 4px 10px', cursor: 'pointer' }}
          color={hasCategoryFilter ? undefined : token.colorPrimary}
          icon={<TagOutlined />}
          onClick={() => {
            setFilters([
              {
                field: 'category.id',
                operator: 'in',
                value: [],
              },
            ]);
          }}
        >
          {t('products.filter.allCategories.label')}
        </Tag>
        {!categoryIsLoading &&
          categories.map((category) => (
            <Tag
              key={category.id}
              color={
                categoryFilters?.includes(category.id) ? 'orange' : undefined
              }
              style={{
                padding: '4px 10px 4px 10px',
                cursor: 'pointer',
              }}
              onClick={() => {
                handleOnTagClick(category.id);
              }}
            >
              {category.name}
            </Tag>
          ))}

        {categoryIsLoading &&
          Array.from({ length: 10 }).map((_, index) => (
            <Skeleton.Button
              key={index}
              style={{
                width: '108px',
                height: '30px',
              }}
              active
            />
          ))}
      </Flex>
      <Divider style={{ margin: '16px 0px' }} />
      <List
        {...productListProps}
        pagination={{
          ...productListProps.pagination,
          showTotal: (total) => (
            <PaginationTotal total={total} entityName={'products'} />
          ),
        }}
        grid={{
          gutter: [16, 16],
          column: 4,
          xxl: 4,
          xl: 4,
          lg: 3,
          md: 2,
          sm: 1,
          xs: 1,
        }}
        renderItem={(item) => (
          <List.Item style={{ height: '100%' }}>
            <Card
              hoverable
              bordered={false}
              className={styles.card}
              styles={{
                body: {
                  padding: 16,
                },
                cover: {
                  position: 'relative',
                },
                actions: {
                  marginTop: 'auto',
                },
              }}
              cover={
                <>
                  <Tag
                    onClick={() => {
                      return go({
                        to: `${showUrl('products', item.id)}`,
                        query: {
                          to: pathname,
                        },
                        options: {
                          keepQuery: true,
                        },
                        type: 'replace',
                      });
                    }}
                    className={cx(styles.viewButton, 'viewButton')}
                    icon={<EyeOutlined />}
                  >
                    View
                  </Tag>
                  <img
                    src={item.imgUrl || 'default-image-url.jpg'}
                    alt={`Product image ${item.id}`}
                    style={{
                      aspectRatio: 288 / 160,
                      objectFit: 'cover',
                    }}
                  />
                </>
              }
              actions={[
                <Flex
                  key="actions"
                  justify="space-between"
                  style={{
                    padding: '0 16px',
                  }}
                >
                  <Typography.Text key="category.title">
                    {item.category}
                  </Typography.Text>
                  <ProductStatus
                    key="status"
                    value={item.status === '1' ? 'true' : 'false'}
                  />
                </Flex>,
              ]}
            >
              <Card.Meta
                title={
                  <Flex>
                    <Typography.Title
                      level={5}
                      ellipsis={{
                        rows: 1,
                        tooltip: item.name,
                      }}
                    >
                      {item.name}
                    </Typography.Title>

                    <NumberField
                      value={item.price}
                      style={{
                        paddingLeft: '8px',
                        marginLeft: 'auto',
                      }}
                      options={{
                        style: 'currency',
                        currency: 'USD',
                      }}
                    />
                  </Flex>
                }
                description={item.description}
              />
            </Card>
          </List.Item>
        )}
      />
    </>
  );
};
