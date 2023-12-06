import React from 'react';
import {View, Skeleton} from 'native-base';
import useDeviceInfo from '../../Hooks/useDeviceInfo';
interface SkeletonLoaderProps {
  skeletonCount: number;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({skeletonCount}) => {
  const deviceInfo = useDeviceInfo();
  const renderSkeletonItems = () => {
    return Array.from({length: skeletonCount}, (unused, index) => (
      <React.Fragment key={index}>
        {deviceInfo.isTablet ? (
          <View
            flexDirection={'row'}
            justifyContent={'center'}
            alignItems={'center'}
            mt={2}
            key={`view-renderSkeletonItems-${index}`}>
            <Skeleton flex={1} p={3} minH="145" maxW={370} rounded={'full'} />
            <Skeleton flex={1} p={3} minH="145" maxW={370} rounded={'full'} />
            <Skeleton flex={1} p={3} minH="145" maxW={370} rounded={'full'} />
          </View>
        ) : (
          <View key={`view-${index}`}>
            <Skeleton p={2} h="125" rounded={'full'} />
          </View>
        )}
      </React.Fragment>
    ));
  };

  return <>{renderSkeletonItems()}</>;
};

export default SkeletonLoader;
