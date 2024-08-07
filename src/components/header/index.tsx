import { DownOutlined, SearchOutlined } from '@ant-design/icons';
import {
  useGetIdentity,
  useGetLocale,
  useList,
  useSetLocale,
  useTranslate,
} from '@refinedev/core';
import type { MenuProps } from 'antd';
import {
  AutoComplete,
  Avatar,
  Button,
  Col,
  Dropdown,
  Grid,
  Input,
  Layout as AntdLayout,
  Row,
  Space,
  theme,
  Typography,
} from 'antd';
import debounce from 'lodash/debounce';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { useConfigProvider } from '../../context';
import type { IBrand, IIdentity, IOrder, IReturnOrder } from '../../interfaces';
import { IconMoon, IconSun } from '../icons';
import { useStyles } from './styled';

const { Header: AntdHeader } = AntdLayout;
const { useToken } = theme;
const { Text } = Typography;
const { useBreakpoint } = Grid;

interface IOptionGroup {
  value: string;
  label: string | React.ReactNode;
}

interface IOptions {
  label: string | React.ReactNode;
  options: Array<IOptionGroup>;
}

export const Header: React.FC = () => {
  const { token } = useToken();
  const { styles } = useStyles();
  const { mode, setMode } = useConfigProvider();
  const { i18n } = useTranslation();
  const locale = useGetLocale();
  const changeLanguage = useSetLocale();
  const { data: user } = useGetIdentity<IIdentity>();
  const screens = useBreakpoint();
  const t = useTranslate();

  const currentLocale = locale();

  const renderTitle = (title: string) => (
    <div className={styles.headerTitle}>
      <Text style={{ fontSize: '16px' }}>{title}</Text>
      <Link to={`/${title.toLowerCase()}`}>{t('search.more')}</Link>
    </div>
  );

  const renderItem = (title: string, imageUrl: string, link: string) => ({
    value: title,
    label: (
      <Link to={link} style={{ display: 'flex', alignItems: 'center' }}>
        {imageUrl && (
          <Avatar
            size={32}
            src={imageUrl}
            style={{ minWidth: '32px', marginRight: '16px' }}
          />
        )}
        <Text>{title}</Text>
      </Link>
    ),
  });

  const [value, setValue] = useState<string>('');
  const [options, setOptions] = useState<Array<IOptions>>([]);

  const { refetch: refetchOrders } = useList<IOrder>({
    resource: 'orders',
    config: {
      filters: [{ field: 'q', operator: 'contains', value }],
    },
    queryOptions: {
      enabled: false,
      onSuccess: (data) => {
        const orderOptionGroup = data.data.map((item) =>
          renderItem(
            `${item.packageName} / #${item.orderCode}`,
            item?.itemInUsers?.[0]?.productId
              ? `/images/products/${item.itemInUsers[0].productId}.jpg`
              : '/images/logo-mark-light.png',
            `/orders/${item.id}`,
          ),
        );
        if (orderOptionGroup.length > 0) {
          setOptions((previousOptions) => [
            ...previousOptions,
            {
              label: renderTitle(t('orders.orders')),
              options: orderOptionGroup,
            },
          ]);
        }
      },
    },
  });

  const { refetch: refetchReturnOrders } = useList<IReturnOrder>({
    resource: 'return-orders',
    config: {
      filters: [{ field: 'q', operator: 'contains', value }],
    },
    queryOptions: {
      enabled: false,
      onSuccess: (data) => {
        const returnOrderOptionGroup = data.data.map((item) =>
          renderItem(
            `Return Order / #${item.id}`,
            '/images/logo-mark-light.png',
            `/return-orders/${item.id}`,
          ),
        );
        if (returnOrderOptionGroup.length > 0) {
          setOptions((previousOptions) => [
            ...previousOptions,
            {
              label: renderTitle(t('returnOrders.returnOrders')),
              options: returnOrderOptionGroup,
            },
          ]);
        }
      },
    },
  });

  const { refetch: refetchBrands } = useList<IBrand>({
    resource: 'brands',
    config: {
      filters: [{ field: 'q', operator: 'contains', value }],
    },
    queryOptions: {
      enabled: false,
      onSuccess: (data) => {
        const brandOptionGroup = data.data.map((item) =>
          renderItem(
            `${item.name} ${item.id}`,
            item?.url,
            `/brands/${item.id}`,
          ),
        );
        if (brandOptionGroup.length > 0) {
          setOptions((previousOptions) => [
            ...previousOptions,
            {
              label: renderTitle(t('brands.brands')),
              options: brandOptionGroup,
            },
          ]);
        }
      },
    },
  });

  useEffect(() => {
    setOptions([]);
    refetchOrders();
    refetchReturnOrders();
    refetchBrands();
  }, [value]);

  const menuItems: MenuProps['items'] = [...(i18n.languages || [])]
    .sort()
    .map((lang: string) => ({
      key: lang,
      onClick: () => changeLanguage(lang),
      icon: (
        <span style={{ marginRight: 8 }}>
          <Avatar size={16} src={`/images/flags/${lang}.svg`} />
        </span>
      ),
      label: lang === 'en' ? 'English' : 'Vietnam',
    }));

  return (
    <AntdHeader
      style={{
        backgroundColor: token.colorBgElevated,
        padding: '0 24px',
      }}
    >
      <Row
        align="middle"
        style={{
          justifyContent: screens.sm ? 'space-between' : 'end',
        }}
      >
        <Col xs={0} sm={8} md={12}>
          <AutoComplete
            style={{
              width: '100%',
              maxWidth: '550px',
            }}
            options={options}
            filterOption={false}
            onSearch={debounce((searchValue: string) => {
              setValue(searchValue);
            }, 300)}
          >
            <Input
              size="large"
              placeholder={t('search.placeholder')}
              suffix={<div className={styles.inputSuffix}>/</div>}
              prefix={<SearchOutlined className={styles.inputPrefix} />}
            />
          </AutoComplete>
        </Col>
        <Col>
          <Space size={screens.md ? 32 : 16} align="center">
            <Dropdown
              menu={{
                items: menuItems,
                selectedKeys: currentLocale ? [currentLocale] : [],
              }}
            >
              <Button
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                <Space>
                  <Text className={styles.languageSwitchText}>
                    {currentLocale === 'en' ? 'English' : 'Vietnam'}
                  </Text>
                  <DownOutlined className={styles.languageSwitchIcon} />
                </Space>
              </Button>
            </Dropdown>

            <Button
              className={styles.themeSwitch}
              type="text"
              icon={mode === 'light' ? <IconMoon /> : <IconSun />}
              onClick={() => {
                setMode(mode === 'light' ? 'dark' : 'light');
              }}
            />

            <Space size={screens.md ? 16 : 8} align="center">
              <Text ellipsis className={styles.userName}>
                {user?.name}
              </Text>
              <Avatar size="large" src={user?.avatar} alt={user?.name} />
            </Space>
          </Space>
        </Col>
      </Row>
    </AntdHeader>
  );
};
