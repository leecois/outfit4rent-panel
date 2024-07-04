import { useTranslate } from '@refinedev/core';
import { Avatar, Table, Tag } from 'antd';
import React from 'react';

import type { ICategory, ICategoryPackage } from '../../../interfaces';

type Props = {
  categoryPackageWithCategory: Array<{
    categoryPackage: ICategoryPackage;
    category: ICategory;
  }>;
};

export const CategoryPackageTable = ({
  categoryPackageWithCategory,
}: Props) => {
  const t = useTranslate();

  return (
    <Table
      dataSource={categoryPackageWithCategory}
      rowKey="categoryPackage.id"
      scroll={{ x: 300, y: 300 }} // Adjust the y value to fit your needs
    >
      <Table.Column title={t('categories.id')} dataIndex={['category', 'id']} />
      <Table.Column
        title={t('categories.name')}
        dataIndex={['category', 'name']}
      />
      <Table.Column
        title={t('categories.url')}
        dataIndex={['category', 'url']}
        key="avatar"
        render={(category) => (
          <Avatar
            shape="circle"
            src={(category as ICategory).url}
            alt="Avatar"
          />
        )}
      />
      <Table.Column
        title={t('categories.description')}
        dataIndex={['category', 'description']}
      />
      <Table.Column
        title={t('categories.maxAvailableQuantity')}
        dataIndex={['categoryPackage', 'maxAvailableQuantity']}
      />
      <Table.Column
        title={t('categories.status')}
        dataIndex={['category', 'status']}
        render={(status: number) => (
          <Tag color={status === 0 ? 'red' : 'green'}>
            {status === 0 ? 'Inactive' : 'Active'}
          </Tag>
        )}
      />
      <Table.Column
        title={t('categories.isFeatured')}
        dataIndex={['category', 'isFeatured']}
        render={(isFeatured: boolean) => (
          <Tag color={isFeatured ? 'blue' : 'grey'}>
            {isFeatured ? 'Featured' : 'Not Featured'}
          </Tag>
        )}
      />
    </Table>
  );
};
