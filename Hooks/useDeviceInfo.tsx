import {useEffect, useState} from 'react';
import DeviceInfo from 'react-native-device-info';
import {Dimensions} from 'react-native';

const useDeviceInfo = () => {
  const [isTablet, setIsTablet] = useState(false);
  const [isPortrait, setIsPortrait] = useState(
    Dimensions.get('window').height > Dimensions.get('window').width,
  );

  useEffect(() => {
    const checkDeviceType = () => {
      const tablet = DeviceInfo.isTablet();
      setIsTablet(tablet);
    };

    checkDeviceType();
    const handleOrientationChange = () => {
      const newOrientation =
        Dimensions.get('window').height > Dimensions.get('window').width;
      setIsPortrait(newOrientation);
    };

    const listenOrientation = Dimensions.addEventListener(
      'change',
      handleOrientationChange,
    );

    return () => {
      listenOrientation.remove();
    };
  }, []);

  return {
    isTablet,
    isPortrait,
  };
};

export default useDeviceInfo;
