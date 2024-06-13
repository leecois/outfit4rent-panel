import type { HttpError } from '@refinedev/core';
import { useList } from '@refinedev/core';
import { Avatar, Flex, Popover } from 'antd';
import { useState } from 'react';

import type { ICategory, IProductList } from '../../../interfaces';
import { ProductDrawerForm } from '../../product/drawer-form';
import { ProductDrawerShow } from '../../product/drawer-show';

type Props = {
  category: ICategory;
};

export const TableCategoryProductColumn = ({ category }: Props) => {
  const [productId, setProductId] = useState<number | null>(null);
  const [drawerAction, setDrawerAction] = useState<'show' | 'edit'>('show');

  const { data, isLoading } = useList<IProductList, HttpError>({
    resource: 'products',
    queryOptions: {
      enabled: !!category.id,
    },
    pagination: {
      mode: 'off',
    },
    filters: [
      {
        field: 'category.id',
        operator: 'eq',
        value: category.id,
      },
    ],
  });

  const products = data?.data || [];

  if (isLoading) {
    return (
      <Flex gap={8} wrap="wrap">
        {Array.from({ length: 10 }).map((_, index) => (
          <Avatar
            key={index}
            shape="square"
            style={{
              aspectRatio: 32 / 32,
              width: 32,
              height: 32,
            }}
          />
        ))}
      </Flex>
    );
  }

  return (
    <>
      <Flex gap={8} wrap="wrap">
        {products.map((product) => {
          const image = product?.imgUrl;
          return (
            <Popover key={product.id} title={product?.name}>
              <Avatar
                shape="square"
                src={image}
                alt={image}
                style={{
                  cursor: 'pointer',
                  aspectRatio: 32 / 32,
                  width: 32,
                  height: 32,
                }}
                onClick={() => {
                  setProductId(product.id);
                }}
              />
            </Popover>
          );
        })}
      </Flex>
      {productId &&
        (drawerAction === 'show' ? (
          <ProductDrawerShow
            id={productId}
            onEdit={() => {
              setDrawerAction('edit');
            }}
            onClose={() => {
              setProductId(null);
            }}
          />
        ) : (
          <ProductDrawerForm
            action="edit"
            id={productId}
            onMutationSuccess={() => {
              setDrawerAction('show');
            }}
            onClose={() => {
              setProductId(null);
            }}
          />
        ))}
    </>
  );
};
