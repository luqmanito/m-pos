import {Skeleton, View} from 'native-base';
import React from 'react';
import {screenWidth} from '../../../App';

const skeletonCount = 10;

export const RenderSkeletonItems = (
  screenSize: number,
): React.ReactElement[] => {
  return Array.from({length: skeletonCount}, (unused, index) => (
    <React.Fragment key={index}>
      {screenSize > 600 ? (
        <View
          flexDirection={'row'}
          justifyContent={'center'}
          alignItems={'center'}
          mt={2}
          key={index}>
          <Skeleton flex={1} p={3} minH="145" maxW={370} rounded={'full'} />
          <Skeleton flex={1} p={3} minH="145" maxW={370} rounded={'full'} />
          <Skeleton flex={1} p={3} minH="145" maxW={370} rounded={'full'} />
        </View>
      ) : (
        <View key={index}>
          <Skeleton p={2} h="155" rounded={'full'} />
        </View>
      )}
    </React.Fragment>
  ));
};

export const skeletonItems = RenderSkeletonItems(screenWidth);
