import { CloseCircleOutlined, LeftOutlined } from '@ant-design/icons';
import { List, ListButton } from '@refinedev/antd';
import { useApiUrl, useShow, useTranslate, useUpdate } from '@refinedev/core';
import {
  Button,
  Col,
  Divider,
  Flex,
  Form,
  Input,
  message,
  Modal,
  Row,
  Skeleton,
} from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';

import { ButtonSuccess } from '../../button';
import { CardWithContent } from '../../components';
import { ReturnOrderDetails } from '../../components/return-orders/fieldsForm';
import { ReturnOrderStatus } from '../../components/return-orders/status';
import { ReturnOrderProducts } from '../../components/return-orders/tableProduct';
import type { IProductInReturnOrder, IReturnOrder } from '../../interfaces';

export const ReturnOrderShow = () => {
  const t = useTranslate();
  const { queryResult } = useShow<IReturnOrder>();
  const { data, isLoading } = queryResult;
  const record = data?.data;
  const { mutate } = useUpdate();
  const apiUrl = useApiUrl();
  const [products, setProducts] = useState<IProductInReturnOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.patch(
          `${apiUrl}/return-orders/${data?.data?.id}/products`,
        );
        setProducts(response.data.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    if (data?.data?.id) {
      fetchProducts();
    }
  }, [apiUrl, data?.data?.id]);

  const handleMutate = (status: number) => {
    if (record) {
      mutate({
        resource: 'return-orders',
        id: record.id.toString(),
        values: {
          status,
        },
      });
    }
  };

  const handleUpdateProducts = async (values: any) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${apiUrl}/return-orders/${record?.id}/products`,
        values,
      );
      setProducts(response.data.data);
      message.success('Products updated successfully');
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error updating products:', error);
      message.error('Failed to update products');
    } finally {
      setLoading(false);
    }
  };

  const canAcceptOrder = isLoading ? false : record?.status === 0;
  const canRejectOrder = isLoading ? false : record?.status === 0;

  return (
    <>
      <Flex>
        <ListButton icon={<LeftOutlined />}>
          {t('return-orders.return-orders')}
        </ListButton>
      </Flex>
      <Divider />
      <List
        breadcrumb={false}
        title={
          isLoading ? (
            <Skeleton.Input
              active
              style={{
                width: '144px',
                minWidth: '144px',
                height: '28px',
              }}
            />
          ) : (
            <>
              {`${t('return-orders.id')} #${record?.id}   `}
              <ReturnOrderStatus
                status={record?.status as number}
              ></ReturnOrderStatus>
            </>
          )
        }
        headerButtons={[
          <ButtonSuccess
            disabled={!canAcceptOrder}
            key="accept"
            onClick={() => setIsModalVisible(true)}
          >
            {t('return-orders.buttons.confirm')}
          </ButtonSuccess>,
          <Button
            disabled={!canRejectOrder}
            key="reject"
            danger
            icon={<CloseCircleOutlined />}
            onClick={() => {
              handleMutate(1);
            }}
          >
            {t('return-orders.buttons.cancelled')}
          </Button>,
        ]}
      >
        <Row gutter={[16, 16]}>
          <Col xl={15} lg={24} md={24} sm={24} xs={24}>
            <Flex gap={16} vertical>
              <ReturnOrderDetails order={record as IReturnOrder} />
            </Flex>
          </Col>

          <Col xl={9} lg={24} md={24} sm={24} xs={24}>
            <CardWithContent
              bodyStyles={{
                padding: 0,
              }}
              title={t('orders.titles.return-orders.products')}
            >
              {record && (
                <ReturnOrderProducts
                  productsInReturnOrder={products}
                  isLoading={loading}
                />
              )}
            </CardWithContent>
          </Col>
        </Row>
      </List>

      <Modal
        title="Update Products"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        confirmLoading={loading}
      >
        <Form form={form} onFinish={handleUpdateProducts}>
          <Form.Item
            name="products"
            label="Products"
            rules={[{ required: true, message: 'Please input the products!' }]}
          >
            <Input.TextArea rows={4} placeholder="Enter product details" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
