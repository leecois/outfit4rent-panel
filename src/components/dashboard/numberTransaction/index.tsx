import type { BarConfig } from '@ant-design/plots';
import { Bar } from '@ant-design/plots';
import { useTranslate } from '@refinedev/core';
import dayjs from 'dayjs';
import { Suspense } from 'react';

import { useConfigProvider } from '../../../context';

type Props = {
  data: BarConfig['data'];
  height: number;
};

export const NumberTransactions = ({ data, height }: Props) => {
  const t = useTranslate();
  const { mode } = useConfigProvider();

  const config: BarConfig = {
    data,
    xField: 'value',
    yField: 'timeText',
    seriesField: 'state',
    animation: true,
    legend: false,
    xAxis: {
      label: {
        formatter: (v) => {
          return new Intl.NumberFormat().format(Number(v));
        },
      },
    },
    yAxis: {
      label: {
        formatter: (v) => {
          if (data.length > 7) {
            return dayjs(v).format('MM/DD');
          }
          return dayjs(v).format('ddd');
        },
      },
    },
    tooltip: {
      formatter: (tooltipData) => {
        return {
          name: t('dashboard.numberTransactions.title'),
          value: new Intl.NumberFormat().format(Number(tooltipData.value)),
        };
      },
    },
    theme: mode,
    color: () => {
      return mode === 'dark' ? '#65A9F3' : '#1677FF';
    },
  };

  return (
    <Suspense>
      <Bar {...config} height={height} />
    </Suspense>
  );
};
