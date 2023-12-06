import React, {FunctionComponent} from 'react';
import {View, Image, Text, Center} from 'native-base';
import shop from '../../Public/Assets/shop.png';
interface EmptyProps {
  title: string;
  subtitle?: string;
  showIMage: boolean;
}

const Empty: FunctionComponent<EmptyProps> = ({title, subtitle, showIMage}) => {
  return (
    <View justifyContent={'center'} alignItems={'center'}>
      {showIMage ? (
        <Image source={shop} alt={'icon'} resizeMode="contain" />
      ) : null}
      <Center>
        <Text bold fontSize={22} numberOfLines={2}>
          {title}
        </Text>
        {subtitle ? (
          <Text mt={2} numberOfLines={2} color={'#888888'} fontSize={16}>
            {subtitle}
          </Text>
        ) : null}
      </Center>
    </View>
  );
};

export default Empty;
