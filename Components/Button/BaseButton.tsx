import React from 'react';
import {Button, Text} from 'native-base';

type PrimaryButtonProps = {
  isDisabled?: boolean;
  onPress: () => void;
  isLoading?: boolean;
  bold?: boolean;
  label?: string;
  type: 'primary' | 'secondary' | 'error' | 'warning';
  mt?: number;
  mb?: number;
  size?: string;
  textColor?: string;
  mx?: number;
  borderRadius?: number;
  my?: number;
};

const BaseButton: React.FC<PrimaryButtonProps> = ({
  isDisabled,
  onPress,
  isLoading,
  label,
  type,
  size,
  borderRadius,
  bold,
  textColor,
  mt,
  mb,
  mx,
  my,
}) => {
  const getColor = () => {
    var color = '';
    switch (type) {
      case 'primary':
        color = 'primary.500';
        break;
      case 'secondary':
        color = 'secondary.400';
        break;
      case 'error':
        color = 'danger';
        break;
      case 'warning':
        color = 'warning';
        break;
    }

    return color;
  };
  return (
    <Button
      borderRadius={borderRadius || 5}
      isDisabled={isDisabled}
      onPress={onPress}
      isLoading={isLoading}
      isLoadingText="Loading"
      mt={mt}
      mb={mb}
      mx={mx}
      my={my}
      bg={getColor()}>
      <Text
        bold={bold || false}
        fontSize={size || 'sm'}
        color={textColor || 'white'}>
        {isLoading ? 'Loading...' : label}
      </Text>
    </Button>
  );
};

export default BaseButton;
