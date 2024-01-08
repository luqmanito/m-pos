import {Icon, Input, Pressable} from 'native-base';
import React, {FC, useContext} from 'react';
import {GestureResponderEvent} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {PrimaryColorContext} from '../../../Context';

interface TouchableInputProps {
  onPress: (event: GestureResponderEvent) => void;
  placeholder: string;
  value: string | null;
}

const CategoryForm: FC<TouchableInputProps> = ({
  onPress,
  placeholder,
  value,
}) => {
  const primaryColor = useContext(PrimaryColorContext);
  return (
    <Pressable onPress={onPress}>
      <Input
        bg="white"
        w="100%"
        borderRadius={10}
        borderWidth="0"
        py="2"
        px="2"
        isReadOnly={true}
        variant="filled"
        type="text"
        placeholder={placeholder}
        value={value || 'All Categories'}
        InputRightElement={
          <Icon
            as={<AntDesign name="down" />}
            size={4}
            mr="2"
            color={primaryColor?.primaryColor}
          />
        }
      />
    </Pressable>
  );
};

export default CategoryForm;
