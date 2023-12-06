import React from 'react';
import {Button, Text} from 'native-base';

type PrimaryButtonProps = {
  isDisabled?: boolean;
  onPress: () => void;
  isLoading?: boolean;
  label?: string;
  type: 'primary' | 'secondary' | 'error';
};

const BaseButton: React.FC<PrimaryButtonProps> = ({
  isDisabled,
  onPress,
  isLoading,
  label,
  type,
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
    }

    return color;
  };
  return (
    <Button
      borderRadius={5}
      isDisabled={isDisabled}
      onPress={onPress}
      isLoading={isLoading}
      isLoadingText="Loading"
      bg={getColor()}>
      <Text fontSize={'sm'} color="white">
        {isLoading ? 'Loading...' : label}
      </Text>
    </Button>
  );
};

export default BaseButton;
