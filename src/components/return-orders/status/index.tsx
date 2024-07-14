import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { useTranslate } from '@refinedev/core';
import { Tag } from 'antd';

type ReturnOrderStatusProps = {
  status: number;
};

export const ReturnOrderStatus: React.FC<ReturnOrderStatusProps> = ({
  status,
}) => {
  const t = useTranslate();
  let color;
  let icon;

  switch (status) {
    case 0: {
      color = 'orange';
      icon = <ClockCircleOutlined />;
      break;
    }
    case 1: {
      color = 'green';
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
      {t(`enum.return-orderStatuses.${status}`)}
    </Tag>
  );
};
