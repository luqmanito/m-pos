import {Button, Text} from 'native-base';
import React, {FC, ReactNode, useContext} from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {PrimaryColorContext} from '../../Context';

interface ReusableButtonProps {
  onPress: () => void;
  bg?: string;
  children: ReactNode;
  color?: string;
  size?: string;
  style?: StyleProp<ViewStyle>;
}

const ReusableButton: FC<ReusableButtonProps> = ({
  onPress,
  bg,
  color,
  children,
  style,
  size,
}) => {
  const primaryColor = useContext(PrimaryColorContext);
  return (
    <Button
      style={style}
      onPress={onPress}
      borderRadius={20}
      bg={bg || primaryColor?.secondaryColor}>
      <Text
        fontSize={size || 'md'}
        mx={2}
        bold
        color={color || primaryColor?.primaryColor}>
        {children}
      </Text>
    </Button>
  );
};

export default ReusableButton;
