import { useList } from '@refinedev/core';
import { Rate } from 'antd';

import type { ICourier, IReview } from '../../../interfaces';

type Props = {
  courier?: ICourier;
};

export const CourierTableColumnRating = (props: Props) => {
  const { data, isLoading } = useList<IReview>({
    resource: 'reviews',
    filters: [
      {
        field: 'order.courier.id',
        operator: 'eq',
        value: props.courier?.id,
      },
    ],
    pagination: {
      mode: 'off',
    },
    queryOptions: {
      enabled: !!props.courier?.id,
    },
  });

  if (isLoading)
    return <Rate key="skeleton" disabled allowHalf defaultValue={0} />;

  const review = data?.data || [];
  const totalStarCount = review?.reduce(
    (accumulator, current) => accumulator + (current?.star || 0),
    0,
  );
  const avgStar = totalStarCount / (review?.length || 1);

  return (
    <Rate
      style={{
        minWidth: '132px',
      }}
      key="with-value"
      disabled
      allowHalf
      defaultValue={avgStar}
    />
  );
};
