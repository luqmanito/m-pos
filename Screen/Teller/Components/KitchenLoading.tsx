import {Skeleton, View} from 'native-base';
import React from 'react';
import {screenWidth} from '../../../App';

const skeletonCount = 3;

export const RenderSkeletonKitchen = (
  screenSize: number,
): React.ReactElement[] => {
  return Array.from({length: skeletonCount}, (unused, index) => (
    <React.Fragment key={index}>
      {screenSize > 600 ? (
        <View flexDirection={'row'} mt={2} key={index}>
          <View w={'30%'} alignItems={'center'}>
            <Skeleton p={3} my={4} minH="175" rounded={'xl'} />
            <Skeleton p={3} minH="175" mt={4} rounded={'xl'} />
            <Skeleton p={3} minH="175" mt={4} rounded={'xl'} />
          </View>
          <View alignItems={'center'} w={'70%'}>
            <Skeleton p={3} minH="545" />
          </View>
        </View>
      ) : (
        <View key={index}>
          <Skeleton p={2} h="155" rounded={'full'} />
        </View>
      )}
    </React.Fragment>
  ));
};

export const skeletonItems = RenderSkeletonKitchen(screenWidth);
