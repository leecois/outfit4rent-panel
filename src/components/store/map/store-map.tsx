import { Flex } from 'antd';
import _debounce from 'lodash/debounce';
import { useCallback } from 'react';

import type { IStore } from '../../../interfaces';
import { convertLatLng } from '../../../utils';
import { Map, MapMarker } from '../../map';

type Props = {
  store?: IStore;
  lat?: number;
  lng?: number;
  zoom?: number;
  isDisabled?: boolean;
  onDragEnd?: ({ lat, lng }: { lat: number; lng: number }) => void;
};

export const StoreMap = (props: Props) => {
  const onDragEndDebounced = useCallback(
    _debounce((lat, lng) => {
      if (props.onDragEnd) {
        props.onDragEnd({ lat, lng });
      }
    }, 1000),
    [],
  );

  const handleDragEnd = (e: any) => {
    if (!props.onDragEnd) return;

    const { lat, lng } = convertLatLng({
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    });
    onDragEndDebounced.cancel();
    onDragEndDebounced(lat, lng);
  };

  const lat = Number(props.lat);
  const lng = Number(props.lng);

  return (
    <Flex
      style={{
        height: '100%',
        width: '100%',
        borderRadius: '8px',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Map
        mapProps={{
          mapId: 'store-map',
          center: {
            lat: lat || 39.668_545_8,
            lng: lng || -75.676_026_4,
          },
        }}
      >
        {lat && lng && (
          <MapMarker
            key={props?.store?.id}
            icon={{
              url: props.isDisabled
                ? '/images/marker-store.svg'
                : '/images/marker-store-pick.svg',
            }}
            position={{
              lat,
              lng,
            }}
            onDragEnd={props.isDisabled ? undefined : handleDragEnd}
          />
        )}
      </Map>
    </Flex>
  );
};
