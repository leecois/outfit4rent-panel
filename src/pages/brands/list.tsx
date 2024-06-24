import { EyeOutlined } from '@ant-design/icons';
import { List, useTable } from '@refinedev/antd';
import type { HttpError } from '@refinedev/core';
import { useGo, useNavigation, useTranslate } from '@refinedev/core';
import { Button, Table, Tag } from 'antd';
import type { PropsWithChildren } from 'react';
import { useLocation } from 'react-router-dom';

import { PaginationTotal } from '../../components';
import { BrandStatus, TableBrandProductColumn } from '../../components/brands';
import type { IBrand } from '../../interfaces';

export const BrandList = ({ children }: PropsWithChildren) => {
  const { tableProps } = useTable<IBrand, HttpError>();
  const t = useTranslate();
  const go = useGo();
  const { pathname } = useLocation();
  const { showUrl } = useNavigation();

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
            <PaginationTotal total={total} entityName="brands" />
          ),
        }}
      >
        <Table.Column<IBrand>
          key="images"
          dataIndex="images"
          width={100}
          title={t('categories.fields.image')}
          render={(images) =>
            images &&
            images.length > 0 && (
              <img
                src={images[0].url}
                alt="Brand Image"
                style={{ width: 50, height: 50 }}
              />
            )
          }
        />
        <Table.Column
          key="name"
          dataIndex="name"
          width={224}
          title={t('categories.fields.title')}
        />
        <Table.Column<IBrand>
          key="name"
          dataIndex="name"
          width={576}
          title={t('categories.fields.products')}
          render={(_, record) => {
            return <TableBrandProductColumn brand={record} />;
          }}
        />

        <Table.Column<IBrand>
          key="status"
          dataIndex="status"
          title={t('categories.fields.isActive.label')}
          render={(_, record) => {
            return <BrandStatus value={record.status} />;
          }}
        />
        <Table.Column<IBrand>
          key="isFeatured"
          dataIndex="isFeatured"
          title={t('categories.fields.isFeatured')}
          render={(isFeatured) => (
            <Tag color={isFeatured ? 'green' : 'volcano'}>
              {isFeatured ? t('common.yes') : t('common.no')}
            </Tag>
          )}
        />
        <Table.Column
          title={t('table.actions')}
          key="actions"
          fixed="right"
          align="center"
          render={(_, record: IBrand) => (
            <Button
              icon={<EyeOutlined />}
              onClick={() => {
                return go({
                  to: `${showUrl('brands', record.id)}`,
                  query: { to: pathname },
                  options: { keepQuery: true },
                  type: 'replace',
                });
              }}
            />
          )}
        />
      </Table>
      {children}
    </List>
  );
};
