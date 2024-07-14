import { NumberField } from '@refinedev/antd';
import { useApiUrl } from '@refinedev/core';
import { Avatar, Flex, Table, Typography } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';

import type { IProductInReturnOrder, IReturnOrder } from '../../../interfaces';

type Props = {
  order?: IReturnOrder;
};

export const ReturnOrderProducts = ({ order }: Props) => {
  const apiUrl = useApiUrl();
  const [products, setProducts] = useState<IProductInReturnOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.patch(
          `${apiUrl}/return-orders/${order?.id}/products`,
        );
        setProducts(response.data.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    if (order?.id) {
      fetchProducts();
    }
  }, [apiUrl, order?.id]);

  return (
    <Table
      dataSource={products}
      loading={loading}
      pagination={false}
      scroll={{ x: true }}
    >
      <Table.Column<IProductInReturnOrder> title="Id" dataIndex="id" key="id" />
      <Table.Column<IProductInReturnOrder>
        title="Product"
        dataIndex="name"
        key="name"
        render={(_, record) => {
          return (
            <Flex gap={16} align="center">
              <Avatar
                shape="square"
                src={record.product?.images[0]?.url || ''}
                alt={record.product.name}
              />
              <Typography.Text>{record.product.name}</Typography.Text>
            </Flex>
          );
        }}
      />
      <Table.Column<IProductInReturnOrder>
        align="end"
        title="Quantity"
        dataIndex="quantity"
        key="quantity"
      />
      <Table.Column<IProductInReturnOrder>
        title="Thorn Money"
        dataIndex="thornMoney"
        align="end"
        key="thornMoney"
        render={(value) => (
          <NumberField
            value={value || 0}
            options={{ style: 'currency', currency: 'USD' }}
          />
        )}
      />
      <Table.Column<IProductInReturnOrder>
        title="Description"
        dataIndex="description"
        align="end"
        key="description"
      />
    </Table>
  );
};
