import {Pressable, Text, View} from 'native-base';
import React from 'react';

type propsItems = {
  label: string;
  value: string;
  onPress: () => void;
  connected?: string | boolean;
  actionText: string;
  color?: string;
};

const ItemList = ({
  label,
  value,
  onPress,
  connected,
  color,
  actionText,
}: propsItems) => {
  return (
    <View
      flexDirection={'row'}
      justifyContent={'space-between'}
      alignItems={'center'}
      bg={'#E7E7E7'}
      my={4}
      p={2}
      borderRadius={4}>
      <View>
        <Text bold>{label || 'UNKNOWN'}</Text>
        <Text>{value}</Text>
      </View>
      {connected && (
        <Text bold color={'emerald.500'}>
          Terhubung
        </Text>
      )}
      {!connected && (
        <Pressable
          onPress={onPress}
          bg={color}
          paddingX={10}
          paddingY={8}
          borderRadius={4}>
          <Text color={'white'}>{actionText}</Text>
        </Pressable>
      )}
    </View>
  );
};

export default ItemList;
