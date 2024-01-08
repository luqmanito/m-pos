import React from 'react';
import {View, Text, Pressable} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {StyleSheet} from 'react-native';
import useNetworkInfo from '../../../Hooks/useNetworkInfo';
import {useAuth} from '../../../Contexts/Auth';
import {useTranslation} from 'react-i18next';

const KitchenHeader: React.FC = () => {
  const {authData} = useAuth();
  const navigation = useNavigation<NavigationProp<any>>();
  const isConnected = useNetworkInfo().isConnected;
  const {t} = useTranslation();
  return (
    <>
      <View
        width={'100%'}
        flexDirection={'row'}
        justifyContent={'space-between'}
        alignItems={'center'}
        px={5}
        py={5}
        paddingTop={30}>
        <View flexDirection={'row'} alignItems={'center'}>
          <Text color={'black'} fontSize={'lg'} bold>
            {authData?.user?.business?.name}
          </Text>
          <Text ml={2} color={'black'} fontSize={'lg'}>
            {`(${authData?.user?.name})`}
          </Text>
        </View>
        <View
          flexDirection={'row'}
          alignItems={'center'}
          justifyContent={'space-between'}>
          <Text color={'black'} fontSize={'3xl'} bold>
            {t('order')}
          </Text>
          <View>
            <MaterialCommunityIcons
              name={isConnected ? 'wifi-check' : 'wifi-remove'}
              size={24}
              color="#fff"
              style={isConnected ? styles.wifi : styles.wifi_off}
            />
          </View>
        </View>
        <View flexDirection={'row'}>
          <Pressable
            onPress={() => {
              navigation.navigate('LogoutScreen');
            }}>
            <MaterialIcons name="logout" size={30} color={'#e85844'} />
          </Pressable>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  wifi: {
    marginLeft: 10,
    color: '#2dbf52',
  },
  wifi_off: {
    marginLeft: 10,
    color: '#fc2b0c',
  },
});

export default KitchenHeader;
