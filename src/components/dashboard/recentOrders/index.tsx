import { NumberField, useTable } from '@refinedev/antd';
import { useNavigation, useSelect, useTranslate } from '@refinedev/core';
import { Space, Table, theme, Typography } from 'antd';

import type { IOrder, IProductList } from '../../../interfaces';
import { OrderActions } from '../..';
import { useStyles } from './styled';

export const RecentOrders: React.FC = () => {
  const { token } = theme.useToken();
  const { styles } = useStyles();
  const { show } = useNavigation();
  const t = useTranslate();

  const { queryResult } = useSelect<IProductList>({
    resource: 'products',
    optionLabel: 'name',
    optionValue: 'id',
    pagination: {
      mode: 'off',
    },
  });

  const products = queryResult?.data?.data || [];

  const productMap = new Map(
    products.map((product) => [product.id, product.name]),
  );

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
        field: 'status',
        operator: 'eq',
        value: 0,
      },
    ],
    syncWithLocation: false,
  });

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
        title={t('orders.fields.orderCode')}
        dataIndex="orderCode"
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
            #{record.orderCode}
          </Typography.Link>
        )}
      />
      <Table.Column<IOrder>
        title={t('orders.fields.customerInfo')}
        dataIndex="receiverName"
        className={styles.column}
        render={(_, record) => (
          <Space
            size={0}
            direction="vertical"
            style={{
              maxWidth: '170px',
            }}
          >
            <Typography.Text
              style={{
                fontSize: 14,
              }}
            >
              {record.receiverName}
            </Typography.Text>
            <Typography.Text
              ellipsis
              style={{
                fontSize: 12,
              }}
              type="secondary"
            >
              {record.receiverPhone}
            </Typography.Text>
            <Typography.Text
              ellipsis
              style={{
                fontSize: 12,
              }}
              type="secondary"
            >
              {record.receiverAddress}
            </Typography.Text>
          </Space>
        )}
      />
      <Table.Column<IOrder>
        title={t('orders.fields.packageAndProducts')}
        dataIndex="packageName"
        className={styles.column}
        render={(_, record) => (
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
                fontWeight: 700,
              }}
            >
              {record.packageName}
            </Typography.Text>
            {record.itemInUsers.length > 0 ? (
              record.itemInUsers.map((item) => (
                <Typography.Paragraph
                  key={item.id}
                  ellipsis={{ rows: 1 }}
                  style={{ maxWidth: '400px', marginBottom: 0 }}
                >
                  {productMap.get(item.productId) || item.productId}
                </Typography.Paragraph>
              ))
            ) : (
              <Typography.Text>-</Typography.Text>
            )}
          </Space>
        )}
      />
      <Table.Column<IOrder>
        title={t('orders.fields.totalPrice')}
        dataIndex="price"
        className={styles.column}
        align="end"
        render={(price, record) => {
          const total =
            record.price +
            record.itemInUsers.reduce(
              (acc, item) => acc + item.quantity * item.deposit,
              0,
            );
          return (
            <NumberField
              value={total}
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
        title={t('table.actions')}
        fixed="right"
        key="actions"
        className={styles.column}
        align="end"
        render={(_, record) => <OrderActions record={record} />}
      />
    </Table>
  );
};
