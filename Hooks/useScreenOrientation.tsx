import {useState, useEffect} from 'react';
import {Dimensions} from 'react-native';

const useScreenOrientation = () => {
  const [orientation, setOrientation] = useState(
    Dimensions.get('window').width > Dimensions.get('window').height
      ? 'landscape'
      : 'portrait',
  );

  const handleLayoutChange = () => {
    const {width, height} = Dimensions.get('window');
    const newOrientation = width > height ? 'landscape' : 'portrait';
    setOrientation(newOrientation);
  };

  useEffect(() => {
    Dimensions.addEventListener('change', handleLayoutChange);
    return () => {
      Dimensions.addEventListener('change', handleLayoutChange);
    };
  }, []);

  return orientation;
};

export default useScreenOrientation;
