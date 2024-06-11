import { NumberField, useTable } from '@refinedev/antd';
import { useNavigation } from '@refinedev/core';
import { Flex, Space, Table, theme, Typography } from 'antd';

import type { IOrder } from '../../../interfaces';
import { getUniqueListWithCount } from '../../../utils';
import { OrderActions } from '../..';
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
    permanentFilter: [
      {
        field: 'status.text',
        operator: 'eq',
        value: 'Pending',
      },
    ],
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
      showHeader={false}
      rowKey="id"
    >
      <Table.Column<IOrder>
        dataIndex="orderNumber"
        className={styles.column}
        render={(_, record) => (
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
            #{record.orderNumber}
          </Typography.Link>
        )}
      />
      <Table.Column<IOrder>
        dataIndex="id"
        className={styles.column}
        render={(_, record) => {
          return (
            <Space
              size={0}
              direction="vertical"
              style={{
                maxWidth: '220px',
              }}
            >
              <Typography.Text
                style={{
                  fontSize: 14,
                }}
              >
                {record?.user?.name} {record?.user?.name}
              </Typography.Text>
              <Typography.Text
                ellipsis
                style={{
                  fontSize: 12,
                }}
                type="secondary"
              >
                {record?.user?.address?.[0]}
              </Typography.Text>
            </Space>
          );
        }}
      />
      <Table.Column<IOrder>
        dataIndex="products"
        className={styles.column}
        render={(products: IOrder['products']) => {
          if (products.length === 0) {
            return <Typography.Text>-</Typography.Text>;
          }

          const uniqueProducts = getUniqueListWithCount<
            IOrder['products'][number]
          >({ list: products, field: 'id' });

          return (
            <Space
              size={0}
              direction="vertical"
              style={{
                maxWidth: '220px',
              }}
            >
              {uniqueProducts.map((product) => (
                <Flex key={product.id} gap={4}>
                  <Typography.Text ellipsis>{product.name}</Typography.Text>
                  <span
                    style={{
                      color: token.colorTextSecondary,
                    }}
                  >
                    x{product.count}
                  </span>
                </Flex>
              ))}
            </Space>
          );
        }}
      />
      <Table.Column<IOrder>
        dataIndex="amount"
        className={styles.column}
        align="end"
        render={(amount) => {
          return (
            <NumberField
              value={amount / 100}
              style={{
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
