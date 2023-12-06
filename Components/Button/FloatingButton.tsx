import {Button, Text} from 'native-base';
import React, {ReactNode, useContext} from 'react';
import {PrimaryColorContext, useLoading} from '../../Context';

interface FloatingButtonProps {
  onPress: () => void;
  label: string;
  customIcon?: ReactNode;
}
const FloatingButton: React.FC<FloatingButtonProps> = ({
  onPress,
  label,
  customIcon,
}) => {
  const {loading} = useLoading();
  const primaryColor = useContext(PrimaryColorContext);

  return (
    <Button
      borderRadius={34}
      isLoading={loading}
      onPress={onPress}
      position={'absolute'}
      alignSelf="center"
      bottom={18}
      bg={primaryColor?.primaryColor}>
      <Text fontSize={'md'} color="white">
        {customIcon ? customIcon : null} {label}
      </Text>
    </Button>
  );
};

export default FloatingButton;
