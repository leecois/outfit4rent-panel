import { EyeOutlined, SearchOutlined } from '@ant-design/icons';
import {
  FilterDropdown,
  getDefaultSortOrder,
  NumberField,
  useTable,
} from '@refinedev/antd';
import type { HttpError } from '@refinedev/core';
import {
  getDefaultFilter,
  useGo,
  useNavigation,
  useTranslate,
} from '@refinedev/core';
import {
  Avatar,
  Button,
  Input,
  InputNumber,
  Table,
  theme,
  Typography,
} from 'antd';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import type { IProduct } from '../../../interfaces';
import { PaginationTotal } from '../../paginationTotal';

export const ProductListTable = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = theme.useToken();
  const t = useTranslate();
  const go = useGo();
  const { pathname } = useLocation();
  const { showUrl } = useNavigation();

  const { tableProps, sorters, filters } = useTable<IProduct, HttpError>({
    filters: {
      initial: [
        {
          field: 'description',
          operator: 'contains',
          value: '',
        },
        {
          field: 'name',
          operator: 'contains',
          value: '',
        },
        {
          field: 'category.id',
          operator: 'in',
          value: [],
        },
        {
          field: 'isActive',
          operator: 'in',
          value: [],
        },
      ],
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.outfit4rent.online/products');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result: IProduct[] = await response.json();
        setProducts(result);
        // eslint-disable-next-line @typescript-eslint/no-shadow
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch products.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <Table
      {...tableProps}
      dataSource={products}
      rowKey="id"
      scroll={{ x: true }}
      pagination={{
        ...tableProps.pagination,
        showTotal: (total) => (
          <PaginationTotal total={total} entityName="products" />
        ),
      }}
    >
      <Table.Column
        title={
          <Typography.Text
            style={{
              whiteSpace: 'nowrap',
            }}
          >
            ID #
          </Typography.Text>
        }
        dataIndex="id"
        key="id"
        width={80}
        render={(value) => (
          <Typography.Text
            style={{
              whiteSpace: 'nowrap',
            }}
          >
            #{value}
          </Typography.Text>
        )}
        filterIcon={(filtered) => (
          <SearchOutlined
            style={{
              color: filtered ? token.colorPrimary : undefined,
            }}
          />
        )}
        defaultFilteredValue={getDefaultFilter('id', filters, 'eq')}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <InputNumber
              addonBefore="#"
              style={{ width: '100%' }}
              placeholder={t('products.filter.id.placeholder')}
            />
          </FilterDropdown>
        )}
      />
      <Table.Column
        title={t('products.fields.images.label')}
        dataIndex="images"
        key="images"
        render={(images: IProduct['images']) => {
          return (
            <Avatar
              shape="square"
              src={images?.[0]?.thumbnailUrl || images?.[0]?.url}
              alt={images?.[0].name}
            />
          );
        }}
      />
      <Table.Column
        title={t('products.fields.name')}
        dataIndex="name"
        key="name"
        filterIcon={(filtered) => (
          <SearchOutlined
            style={{
              color: filtered ? token.colorPrimary : undefined,
            }}
          />
        )}
        defaultFilteredValue={getDefaultFilter('name', filters, 'contains')}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <Input placeholder={t('products.filter.name.placeholder')} />
          </FilterDropdown>
        )}
        render={(value: string) => {
          return (
            <Typography.Text
              style={{
                whiteSpace: 'nowrap',
              }}
            >
              {value}
            </Typography.Text>
          );
        }}
      />
      <Table.Column
        title={t('products.fields.description')}
        dataIndex="description"
        key="description"
        width={432}
        filterIcon={(filtered) => (
          <SearchOutlined
            style={{
              color: filtered ? token.colorPrimary : undefined,
            }}
          />
        )}
        defaultFilteredValue={getDefaultFilter(
          'description',
          filters,
          'contains',
        )}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <Input placeholder={t('products.filter.description.placeholder')} />
          </FilterDropdown>
        )}
        render={(description: string) => {
          return (
            <Typography.Paragraph
              ellipsis={{ rows: 1, tooltip: true }}
              style={{
                maxWidth: '400px',
                marginBottom: 0,
              }}
            >
              {description}
            </Typography.Paragraph>
          );
        }}
      />
      <Table.Column
        title={t('products.fields.price')}
        dataIndex="price"
        key="price"
        align="right"
        sorter
        defaultSortOrder={getDefaultSortOrder('price', sorters)}
        render={(price: number) => {
          return (
            <NumberField
              value={price}
              style={{
                width: '80px',
                fontVariantNumeric: 'tabular-nums',
                whiteSpace: 'nowrap',
              }}
              options={{
                style: 'currency',
                currency: 'USD',
              }}
            />
          );
        }}
      />
      <Table.Column
        title={t('products.fields.size')}
        dataIndex="size"
        key="size"
        render={(size: string) => {
          return (
            <Typography.Text
              style={{
                whiteSpace: 'nowrap',
              }}
            >
              {size}
            </Typography.Text>
          );
        }}
      />
      <Table.Column
        title={t('products.fields.category')}
        dataIndex="category"
        key="category"
        render={(category: string) => {
          return (
            <Typography.Text
              style={{
                whiteSpace: 'nowrap',
              }}
            >
              {category}
            </Typography.Text>
          );
        }}
      />
      <Table.Column
        title={t('products.fields.brand')}
        dataIndex="brand"
        key="brand"
        render={(brand: string) => {
          return (
            <Typography.Text
              style={{
                whiteSpace: 'nowrap',
              }}
            >
              {brand}
            </Typography.Text>
          );
        }}
      />
      <Table.Column
        title={t('products.fields.type')}
        dataIndex="type"
        key="type"
        render={(type: string) => {
          return (
            <Typography.Text
              style={{
                whiteSpace: 'nowrap',
              }}
            >
              {type}
            </Typography.Text>
          );
        }}
      />
      <Table.Column
        title={t('table.actions')}
        key="actions"
        fixed="right"
        align="center"
        render={(_, record: IProduct) => {
          return (
            <Button
              icon={<EyeOutlined />}
              onClick={() => {
                return go({
                  to: `${showUrl('products', record.id)}`,
                  query: {
                    to: pathname,
                  },
                  options: {
                    keepQuery: true,
                  },
                  type: 'replace',
                });
              }}
            />
          );
        }}
      />
    </Table>
  );
};
