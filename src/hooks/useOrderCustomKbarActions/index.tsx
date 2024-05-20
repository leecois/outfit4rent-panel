import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useTranslate, useUpdate } from '@refinedev/core';
import type { Action } from '@refinedev/kbar';
import { createAction, Priority, useRegisterActions } from '@refinedev/kbar';
import { useEffect, useState } from 'react';

import type { IOrder } from '../../interfaces';

export const useOrderCustomKbarActions = (order?: IOrder): void => {
  const t = useTranslate();
  const { mutate } = useUpdate();

  const canAcceptOrder = order?.status.text === 'Pending';
  const canRejectOrder =
    order?.status.text === 'Pending' ||
    order?.status.text === 'Ready' ||
    order?.status.text === 'On The Way';

  const [actions, setActions] = useState<Array<Action>>([]);

  const handleMutate = (status: { id: number; text: string }) => {
    if (order) {
      mutate(
        {
          resource: 'orders',
          id: order.id.toString(),
          values: {
            status,
          },
        },
        {
          onSuccess: () => {
            setActions([]);
          },
        },
      );
    }
  };

  useEffect(() => {
    const preActions: Array<Action> = [];
    if (canAcceptOrder) {
      preActions.push(
        createAction({
          name: t('buttons.accept'),
          icon: <CheckCircleOutlined />,
          section: 'actions',
          perform: () => {
            handleMutate({
              id: 2,
              text: 'Ready',
            });
          },
          priority: Priority.HIGH,
        }),
      );
    }
    if (canRejectOrder) {
      preActions.push(
        createAction({
          name: t('buttons.reject'),
          icon: <CloseCircleOutlined />,
          section: 'actions',
          perform: () => {
            handleMutate({
              id: 5,
              text: 'Cancelled',
            });
          },
          priority: Priority.HIGH,
        }),
      );
    }
    setActions(preActions);
  }, [order]);
  useRegisterActions(actions, [actions]);
};
