import { EyeOutlined, SearchOutlined } from '@ant-design/icons';
import {
  FilterDropdown,
  getDefaultSortOrder,
  NumberField,
  useSelect,
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
  Select,
  Table,
  theme,
  Typography,
} from 'antd';
import { useLocation } from 'react-router-dom';

import type { ICategory, IProductList } from '../../../interfaces';
import { PaginationTotal } from '../../paginationTotal';
import { ProductStatus } from '../status';

export const ProductListTable = () => {
  const { token } = theme.useToken();
  const t = useTranslate();
  const go = useGo();
  const { pathname } = useLocation();
  const { showUrl } = useNavigation();

  const { tableProps, sorters, filters } = useTable<IProductList, HttpError>({
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
          field: 'category',
          operator: 'in',
          value: [],
        },
        {
          field: 'status',
          operator: 'in',
          value: [],
        },
      ],
    },
  });

  const { selectProps: categorySelectProps } = useSelect<ICategory>({
    resource: 'categories',
    optionLabel: 'name',
    optionValue: 'name',
    defaultValue: getDefaultFilter('category', filters, 'in'),
  });

  return (
    <Table
      {...tableProps}
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
        title={t('products.fields.imgUrl.label')}
        dataIndex="imgUrl"
        key="imgUrl"
        render={(imgUrl: string) => {
          return (
            <Avatar
              shape="square"
              src={imgUrl || 'default-image-url.jpg'}
              alt={`Product image`}
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
      <Table.Column<IProductList>
        title={t('products.fields.category')}
        dataIndex="category"
        key="category"
        width={128}
        defaultFilteredValue={getDefaultFilter('category', filters, 'in')}
        filterDropdown={(props) => {
          return (
            <FilterDropdown
              {...props}
              selectedKeys={props.selectedKeys.map(String)}
            >
              <Select
                {...categorySelectProps}
                style={{ width: '200px' }}
                allowClear
                mode="multiple"
                placeholder={t('products.filter.category.placeholder')}
              />
            </FilterDropdown>
          );
        }}
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
        title={t('products.fields.status.label')}
        dataIndex="status"
        key="status"
        sorter
        defaultSortOrder={getDefaultSortOrder('status', sorters)}
        defaultFilteredValue={getDefaultFilter('status', filters, 'in')}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <Select
              style={{ width: '200px' }}
              allowClear
              mode="multiple"
              placeholder={t('products.filter.status.placeholder')}
            >
              <Select.Option value="1">
                {t('products.fields.status.active')}
              </Select.Option>
              <Select.Option value="0">
                {t('products.fields.status.inactive')}
              </Select.Option>
            </Select>
          </FilterDropdown>
        )}
        render={(status: string) => {
          return <ProductStatus value={status === '1' ? 'true' : 'false'} />;
        }}
      />
      <Table.Column
        title={t('table.actions')}
        key="actions"
        fixed="right"
        align="center"
        render={(_, record: IProductList) => {
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
