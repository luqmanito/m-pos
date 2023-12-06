import React, {useContext} from 'react';
import {Pressable, Text} from 'native-base';
import {PrimaryColorContext} from '../../Context';

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
  width: number;
}

const TabButton: React.FC<TabButtonProps> = ({
  label,
  isActive,
  onPress,
  width,
}) => {
  const primaryColor = useContext(PrimaryColorContext);
  return (
    <Pressable
      p={2}
      bg={isActive ? primaryColor?.secondaryColor : null}
      w={`${width}%`}
      onPress={onPress}
      borderRadius={20}>
      <Text
        textAlign={'center'}
        bold
        color={primaryColor?.primaryColor}
        borderRadius={20}>
        {label}
      </Text>
    </Pressable>
  );
};

export default TabButton;
