import { DateField } from '@refinedev/antd';
import { useApiUrl, useCustom, useTranslate } from '@refinedev/core';
import { Avatar, Image, Rate, Table } from 'antd';

import type { IPackage, IReview } from '../../../interfaces';

type Props = {
  package?: IPackage;
};

interface ApiResponse {
  message: string;
  statusCode: string;
  data: IReview[];
}

export const PackageReviewTable = (props: Props) => {
  const t = useTranslate();
  const API_URL = useApiUrl();

  const { data, isLoading } = useCustom<ApiResponse>({
    url: `${API_URL}/reviews/packages/${props.package?.id}`,
    method: 'get',
    queryOptions: {
      enabled: !!props.package?.id,
    },
  });

  const columns = [
    {
      title: t('reviews.fields.customer'),
      dataIndex: 'customerName',
      render: (customerName: string, record: IReview) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar src={record.customerAvatar} style={{ marginRight: 8 }} />
          {customerName}
        </div>
      ),
    },
    {
      title: t('reviews.fields.title'),
      dataIndex: 'title',
    },
    {
      title: t('reviews.fields.content'),
      dataIndex: 'content',
    },
    {
      title: t('reviews.fields.rating'),
      dataIndex: 'numberStars',
      render: (value: number) => (
        <Rate
          style={{
            minWidth: '132px',
          }}
          disabled
          allowHalf
          value={value}
        />
      ),
    },
    {
      title: t('reviews.fields.date'),
      dataIndex: 'date',
      render: (value: string) => (
        <DateField value={value} format="YYYY-MM-DD HH:mm:ss" />
      ),
    },
    {
      title: t('reviews.fields.packageId'),
      dataIndex: 'packageId',
    },
    {
      title: t('reviews.fields.images'),
      dataIndex: 'images',
      render: (images: { url: string }[]) => (
        <div style={{ display: 'flex', gap: 8 }}>
          {images.map((image, index) => (
            <Image
              key={index}
              src={image.url}
              width={50}
              height={50}
              style={{ objectFit: 'cover' }}
            />
          ))}
        </div>
      ),
    },
  ];

  return (
    <Table
      dataSource={data?.data.data}
      columns={columns}
      loading={isLoading}
      rowKey="id"
      pagination={false}
    />
  );
};
