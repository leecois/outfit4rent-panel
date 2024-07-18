import { useApiUrl, useCustom } from '@refinedev/core';
import { Rate, Tooltip } from 'antd';

import type { IPackage, IPackageRating } from '../../../interfaces';

type Props = {
  package: IPackage;
};

interface ApiResponse {
  message: string;
  statusCode: string;
  data: IPackageRating;
}

export const PackageTableColumnRating = ({ package: pkg }: Props) => {
  const API_URL = useApiUrl();
  const { data, isLoading } = useCustom<ApiResponse>({
    url: `${API_URL}/reviews/packages/${pkg.id}/ratings`,
    method: 'get',
    queryOptions: {
      enabled: !!pkg.id,
    },
  });

  if (isLoading) {
    return (
      <Rate style={{ minWidth: '132px' }} disabled allowHalf defaultValue={0} />
    );
  }

  const rating = data?.data;

  return (
    <Tooltip title={`${rating?.data?.quantityOfReviews} reviews`}>
      <Rate
        style={{ minWidth: '132px' }}
        disabled
        allowHalf
        value={rating?.data?.averageStar || 0}
      />
    </Tooltip>
  );
};
