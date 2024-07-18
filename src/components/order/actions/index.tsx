import { BellOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useInvalidate, useTranslate, useUpdate } from '@refinedev/core';
import { Dropdown, Menu } from 'antd';

import type { IOrder } from '../../../interfaces';
import { TableActionButton } from '../../tableActionButton';

type OrderActionProps = {
  record: IOrder;
};

export const OrderActions: React.FC<OrderActionProps> = ({ record }) => {
  const t = useTranslate();
  const { mutate } = useUpdate();
  const invalidate = useInvalidate();

  const updateStatus = (orderId: number, status: number) => {
    mutate(
      {
        resource: `orders`,
        id: `${orderId}/status/${status}`,
        values: { status },
      },
      {
        onSuccess: () => {
          invalidate({
            resource: 'orders',
            invalidates: ['list'],
          });
        },
      },
    );
  };

  const moreMenu = (_order: IOrder) => (
    <Menu
      mode="vertical"
      onClick={({ domEvent }) => {
        domEvent.stopPropagation();
      }}
    >
      <Menu.Item
        key="accept"
        style={{
          fontSize: 15,
          display: 'flex',
          alignItems: 'center',
          fontWeight: 500,
        }}
        disabled={record.status !== 0}
        icon={
          <BellOutlined
            style={{
              color: '#13c2c2',
              fontSize: 17,
              fontWeight: 500,
            }}
          />
        }
        onClick={() => {
          updateStatus(record.id, 1);
        }}
      >
        {t('buttons.accept')}
      </Menu.Item>
      <Menu.Item
        key="cancel"
        style={{
          fontSize: 15,
          display: 'flex',
          alignItems: 'center',
          fontWeight: 500,
        }}
        disabled={record.status !== 0}
        icon={
          <CloseCircleOutlined
            style={{
              color: '#EE2A1E',
              fontSize: 17,
            }}
          />
        }
        onClick={() => {
          updateStatus(record.id, -1);
        }}
      >
        {t('buttons.cancel')}
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={moreMenu(record)} trigger={['click']}>
      <TableActionButton />
    </Dropdown>
  );
};
