import { useTable } from '@refinedev/antd';
import { useNavigation } from '@refinedev/core';
import { Table, theme, Typography } from 'antd';
import dayjs from 'dayjs';

import type { IOrder } from '../../../interfaces';
import { OrderActions, OrderStatus } from '../../order';
import { useStyles } from './styled';

export const RecentOrders: React.FC = () => {
  const { token } = theme.useToken();
  const { styles } = useStyles();

  const { tableProps } = useTable<IOrder>({
    resource: 'orders',
    initialSorter: [
      {
        field: 'createdAt',
        order: 'desc',
      },
    ],
    initialPageSize: 10,
    syncWithLocation: false,
  });

  const { show } = useNavigation();

  return (
    <Table
      {...tableProps}
      pagination={{
        ...tableProps.pagination,
        hideOnSinglePage: true,
        showSizeChanger: false,
        className: styles.pagination,
      }}
      rowKey="id"
    >
      <Table.Column<IOrder>
        dataIndex="status"
        title="Status"
        className={styles.column}
        render={(status) => <OrderStatus status={status} />}
      />
      <Table.Column<IOrder>
        dataIndex="orderCode"
        title="Order Code"
        className={styles.column}
        render={(orderCode, record) => (
          <Typography.Link
            strong
            onClick={() => {
              show('orders', record.id);
            }}
            style={{
              whiteSpace: 'nowrap',
              color: token.colorTextHeading,
            }}
          >
            {orderCode}
          </Typography.Link>
        )}
      />
      <Table.Column<IOrder>
        dataIndex="createdAt"
        title="Time"
        className={styles.column}
        render={(createdAt) => (
          <Typography.Text>{dayjs(createdAt).fromNow()}</Typography.Text>
        )}
      />
      <Table.Column<IOrder>
        fixed="right"
        key="actions"
        className={styles.column}
        align="end"
        render={(_, record) => <OrderActions record={record} />}
      />
    </Table>
  );
};
