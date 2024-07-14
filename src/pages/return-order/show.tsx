import { CloseCircleOutlined, LeftOutlined } from '@ant-design/icons';
import { List, ListButton } from '@refinedev/antd';
import { useShow, useTranslate, useUpdate } from '@refinedev/core';
import { Button, Col, Divider, Flex, Row, Skeleton } from 'antd';

import { ButtonSuccess } from '../../button';
import { CardWithContent } from '../../components';
import { ReturnOrderDetails } from '../../components/return-orders/fieldsForm';
import { ReturnOrderProducts } from '../../components/return-orders/tableProduct';
import type { IReturnOrder } from '../../interfaces';

export const ReturnOrderShow = () => {
  const t = useTranslate();
  const { queryResult } = useShow<IReturnOrder>();
  const { data, isLoading } = queryResult;
  const record = data?.data;
  const { mutate } = useUpdate();

  const handleMutate = (status: { id: number; text: string }) => {
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
                minWidth: '144pxpx',
                height: '28px',
              }}
            />
          ) : (
            `${t('return-orders.titles.list')} #${record?.id}`
          )
        }
        headerButtons={[
          <ButtonSuccess
            disabled={!canAcceptOrder}
            key="accept"
            onClick={() => {
              handleMutate({
                id: 2,
                text: 'Ready',
              });
            }}
          >
            {t('buttons.accept')}
          </ButtonSuccess>,
          <Button
            disabled={!canRejectOrder}
            key="reject"
            danger
            icon={<CloseCircleOutlined />}
            onClick={() => {
              handleMutate({
                id: 5,
                text: 'Cancelled',
              });
            }}
          >
            {t('buttons.reject')}
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
              title={t('orders.titles.return-orders')}
            >
              {record && <ReturnOrderProducts order={record} />}
            </CardWithContent>
          </Col>
        </Row>
      </List>
    </>
  );
};
