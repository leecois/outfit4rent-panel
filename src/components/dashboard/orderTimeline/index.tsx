import { useInfiniteList, useNavigation } from '@refinedev/core';
import { Divider, List, Skeleton, Spin, theme, Typography } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import InfiniteScroll from 'react-infinite-scroll-component';

import type { IOrder } from '../../../interfaces';
import { OrderStatus } from '../../order';

dayjs.extend(relativeTime);

type Props = {
  height?: string;
};

export const OrderTimeline = ({ height = '432px' }: Props) => {
  const { token } = theme.useToken();
  const { show } = useNavigation();

  const { data, isLoading, hasNextPage, fetchNextPage } =
    useInfiniteList<IOrder>({
      resource: 'orders',
      sorters: [
        {
          field: 'createdAt',
          order: 'desc',
        },
      ],
      pagination: {
        current: 1,
        pageSize: 8,
      },
    });

  const orders = data?.pages.flatMap((page) => page.data) || [];

  return (
    <div
      id="scrollableDiv"
      style={{
        display: 'block',
        height,
        overflow: 'auto',
      }}
    >
      <InfiniteScroll
        dataLength={orders.length}
        next={() => fetchNextPage()}
        hasMore={hasNextPage || false}
        loader={
          <Spin
            spinning
            style={{
              height: '56px',
              display: 'flex',
              justifyContent: 'center',
              marginTop: '16px',
            }}
          />
        }
        endMessage={<Divider plain>That&apos;s all, nothing more.</Divider>}
        scrollableTarget="scrollableDiv"
      >
        <List
          itemLayout="horizontal"
          dataSource={orders}
          renderItem={(item) => {
            return (
              <List.Item
                onClick={() => {
                  show('orders', item.id);
                }}
                style={{
                  cursor: 'pointer',
                  height: '54px',
                  padding: '16px',
                }}
              >
                <Skeleton
                  style={{ display: 'flex', width: '100%' }}
                  avatar={false}
                  title={false}
                  paragraph={{ rows: 1, width: '100%' }}
                  loading={isLoading}
                  active
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                    }}
                  >
                    <div style={{ width: '128px' }}>
                      <OrderStatus status={item.status} />
                    </div>
                    <Typography.Text strong>#{item.orderCode}</Typography.Text>
                    <Typography.Text
                      style={{
                        color: token.colorTextDescription,
                      }}
                    >
                      {dayjs(item.createdAt).fromNow()}
                    </Typography.Text>
                  </div>
                </Skeleton>
              </List.Item>
            );
          }}
        />
      </InfiniteScroll>
    </div>
  );
};
