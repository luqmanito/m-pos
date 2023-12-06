import {useEffect, useState} from 'react';
import {Dimensions} from 'react-native';

const useOrientation = () => {
  const [isPortrait, setIsPortrait] = useState(
    Dimensions.get('window').height > Dimensions.get('window').width,
  );

  useEffect(() => {
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

  return isPortrait;
};

export default useOrientation;
