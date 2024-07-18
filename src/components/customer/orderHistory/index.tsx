import { DateField, NumberField, useTable } from '@refinedev/antd';
import type { HttpError } from '@refinedev/core';
import { useNavigation, useTranslate } from '@refinedev/core';
import { Table, Typography } from 'antd';

import type { IOrder, IOrderFilterVariables, IUser } from '../../../interfaces';
import { OrderStatus } from '../../order';

type Props = {
  customer?: IUser;
};

export const CustomerOrderHistory = ({ customer }: Props) => {
  const t = useTranslate();
  const { show } = useNavigation();

  const { tableProps } = useTable<IOrder, HttpError, IOrderFilterVariables>({
    resource: 'orders',
    initialSorter: [
      {
        field: 'createdAt',
        order: 'desc',
      },
    ],
    permanentFilter: [
      {
        field: 'customerId',
        operator: 'eq',
        value: customer?.id,
      },
    ],
    initialPageSize: 4,
    queryOptions: {
      enabled: customer !== undefined,
    },
    syncWithLocation: false,
  });

  return (
    <Table
      {...tableProps}
      rowKey="id"
      onRow={(record) => {
        return {
          onClick: () => {
            show('orders', record.id);
          },
        };
      }}
      pagination={{
        ...tableProps.pagination,
        hideOnSinglePage: true,
      }}
    >
      <Table.Column
        title={t('orders.fields.orderCode')}
        dataIndex="orderCode"
        key="orderCode"
        render={(value) => (
          <Typography.Text style={{ whiteSpace: 'nowrap' }}>
            #{value}
          </Typography.Text>
        )}
      />
      <Table.Column
        key="status"
        dataIndex="status"
        title={t('orders.fields.status')}
        render={(status) => {
          return <OrderStatus status={status} />;
        }}
      />
      <Table.Column
        dataIndex="packageName"
        title={t('orders.fields.packageName')}
        key="packageName"
      />
      <Table.Column<IOrder>
        dataIndex="price"
        align="right"
        title={t('orders.fields.price')}
        render={(price) => {
          return (
            <NumberField
              value={price}
              style={{ whiteSpace: 'nowrap' }}
              options={{ style: 'currency', currency: 'USD' }}
            />
          );
        }}
      />
      <Table.Column<IOrder>
        dataIndex="dateFrom"
        title={t('orders.fields.dateFrom')}
        render={(value) => (
          <DateField value={value} format="YYYY-MM-DD HH:mm:ss" />
        )}
      />
      <Table.Column<IOrder>
        dataIndex="dateTo"
        title={t('orders.fields.dateTo')}
        render={(value) => (
          <DateField value={value} format="YYYY-MM-DD HH:mm:ss" />
        )}
      />
    </Table>
  );
};
