import {
  BellOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { useTranslate } from '@refinedev/core';
import { Tag } from 'antd';

type OrderStatusProps = {
  status: number;
};

export const OrderStatus: React.FC<OrderStatusProps> = ({ status }) => {
  const t = useTranslate();
  let color;
  let icon;

  switch (status) {
    case 0: {
      color = 'gold';
      icon = <ClockCircleOutlined />;
      break;
    }
    case 1: {
      color = 'green';
      icon = <BellOutlined />;
      break;
    }
    case 2: {
      color = 'gray';
      icon = <CheckCircleOutlined />;
      break;
    }
    case -1: {
      color = 'red';
      icon = <CloseCircleOutlined />;
      break;
    }
    default: {
      color = 'default';
      icon = null;
      break;
    }
  }

  return (
    <Tag color={color} icon={icon}>
      {t(`enum.orderStatuses.${status}`)}
    </Tag>
  );
};
