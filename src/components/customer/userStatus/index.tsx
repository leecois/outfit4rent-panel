import { CheckCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';
import { useTranslate } from '@refinedev/core';
import { Tag, theme, Typography } from 'antd';

import { useConfigProvider } from '../../../context';
import type { IUser } from '../../../interfaces';

type Props = {
  value: IUser['isActive'];
};

export const UserStatus = ({ value }: Props) => {
  const t = useTranslate();
  const { token } = theme.useToken();
  const { mode } = useConfigProvider();
  const isDark = mode === 'dark';

  let textColor;
  if (value) {
    textColor = isDark ? token.green7 : '#3C8618';
  } else {
    textColor = token.colorTextTertiary;
  }
  return (
    <Tag
      color={value ? 'green' : 'default'}
      style={{
        color: textColor,
      }}
      icon={value ? <CheckCircleOutlined /> : <PauseCircleOutlined />}
    >
      <Typography.Text
        style={{
          color: textColor,
        }}
      >
        {t(`users.fields.isActive.${value}`)}
      </Typography.Text>
    </Tag>
  );
};
