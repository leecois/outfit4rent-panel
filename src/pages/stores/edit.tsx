import { LeftOutlined } from '@ant-design/icons';
import { ListButton } from '@refinedev/antd';
import { useTranslate } from '@refinedev/core';
import { Divider, Flex } from 'antd';

import { StoreForm } from '../../components';

export const StoreEdit = () => {
  const t = useTranslate();

  return (
    <>
      <Flex>
        <ListButton icon={<LeftOutlined />}>{t('stores.stores')}</ListButton>
      </Flex>
      <Divider />
      <StoreForm action="edit" />
    </>
  );
};
