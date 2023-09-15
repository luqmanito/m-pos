import React from 'react';

import {View, Text} from 'native-base';
import Svg, {Path, Defs, LinearGradient, Stop} from 'react-native-svg';
import {StyleSheet} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import useNetworkInfo from '../../Hooks/useNetworkInfo';
import cache from '../../Util/cache';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const HeaderComponent: React.FC = () => {
  const isConnected = useNetworkInfo().isConnected;
  const navigation = useNavigation<NavigationProp<any>>();

  const deleteCache = async (): Promise<void> => {
    // const dataUser = await cache.removeItem('paymentSubmissions');
    const allKeys = await AsyncStorage.getAllKeys();
    // const data = await cache.get('paymentSubmissions');
    console.log('All stored keys:', allKeys);
    // console.log(data);
    // return dataUser;
  };

  return (
    <>
      <View
        width={'100%'}
        position={'absolute'}
        flexDirection={'row'}
        alignItems={'center'}
        justifyContent={'space-between'}
        paddingX={5}
        paddingTop={30}>
        <View flexDirection={'row'} alignItems={'center'}>
          <Text color={'white'} fontSize={'lg'} bold>
            Hidup Merchant{' '}
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
          <MaterialIcons
            onPress={() => deleteCache()}
            name="payments"
            size={24}
            color="#fff"
            style={styles.icon}
          />
          <FontAwesome
            onPress={() => navigation.navigate('NotificationScreen')}
            name="bell"
            size={24}
            color="#fff"
            style={styles.icon}
          />
          <FontAwesome
            onPress={() => navigation.navigate('SettingScreen')}
            name="gear"
            size={24}
            color="#fff"
            style={styles.icon}
          />
        </View>
      </View>

      <View zIndex={-1} h={92} overflow="hidden" bg={'#0c50ef'}>
        {/* First wave pattern */}
        <Svg
          height="100%"
          width="100%"
          viewBox="0 0 1440 320"
          style={styles.wave}>
          <Defs>
            <LinearGradient id="gradient1" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#0c50ef" />
              <Stop offset="1" stopColor="#00a1ff" />
            </LinearGradient>
          </Defs>
          <Path
            fill="url(#gradient1)"
            fillOpacity={1}
            d="M0,160C160,192,320,224,480,202.7C640,181,800,107,960,85.3C1120,64,1280,96,1360,112L1440,128L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,0,320L0,320Z"
          />
        </Svg>

        {/* Second wave pattern */}
        <Svg
          height="100%"
          width="100%"
          viewBox="0 0 1440 320"
          style={styles.wave}>
          <Defs>
            <LinearGradient id="gradient2" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#33ccff" />
              <Stop offset="1" stopColor="#00a1ff" />
            </LinearGradient>
          </Defs>
          <Path
            fill="url(#gradient2)"
            fillOpacity={1}
            d="M0,96C160,128,320,192,480,186.7C640,181,800,107,960,85.3C1120,64,1280,96,1360,112L1440,128L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,0,0L0,0Z"
          />
        </Svg>

        {/* Third wave pattern */}
        <Svg
          height="100%"
          width="100%"
          viewBox="0 0 1440 320"
          style={styles.wave}>
          <Defs>
            <LinearGradient id="gradient3" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#0c50ef" />
              <Stop offset="1" stopColor="#4d79ff" />
            </LinearGradient>
          </Defs>
          <Path
            fill="url(#gradient3)"
            fillOpacity={1}
            d="M0,96C160,128,320,192,480,186.7C640,181,800,107,960,85.3C1120,64,1280,96,1360,112L1440,128L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,0,0L0,0Z"
          />
        </Svg>
      </View>
      {/* </View> */}
    </>
  );
};

const styles = StyleSheet.create({
  wave: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  icon: {
    marginLeft: 15,
  },
  wifi: {
    marginLeft: 5,
    color: '#2dbf52',
  },
  wifi_off: {
    marginLeft: 5,
    color: '#fc2b0c',
  },
});
