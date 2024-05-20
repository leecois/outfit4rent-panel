import { List, useTable } from '@refinedev/antd';
import type { HttpError } from '@refinedev/core';
import { useTranslate } from '@refinedev/core';
import { Table } from 'antd';

import {
  CategoryStatus,
  PaginationTotal,
  TableCategoryProductColumn,
} from '../../components';
import type { ICategory } from '../../interfaces';

export const CategoryList = () => {
  const { tableProps } = useTable<ICategory, HttpError>();

  const t = useTranslate();

  return (
    <List>
      <Table
        {...tableProps}
        rowKey="id"
        scroll={{
          x: true,
        }}
        pagination={{
          ...tableProps.pagination,
          hideOnSinglePage: true,
          showTotal: (total) => (
            <PaginationTotal total={total} entityName="categories" />
          ),
        }}
      >
        <Table.Column
          key="title"
          dataIndex="title"
          width={224}
          title={t('categories.fields.title')}
        />
        <Table.Column<ICategory>
          key="id"
          dataIndex="id"
          width={576}
          title={t('categories.fields.products')}
          render={(_, record) => {
            return <TableCategoryProductColumn category={record} />;
          }}
        />
        <Table.Column<ICategory>
          key="isActive"
          dataIndex="isActive"
          title={t('categories.fields.isActive.label')}
          render={(_, record) => {
            return <CategoryStatus value={record.isActive} />;
          }}
        />
      </Table>
    </List>
  );
};
