import {Text, View} from 'native-base';
import React, {FunctionComponent} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {Pressable} from 'react-native';
import useNetworkInfo from '../../Hooks/useNetworkInfo';

interface NavBarProps {
  msg: string;
}

const NavBar: FunctionComponent<NavBarProps> = ({msg}) => {
  const isConnected = useNetworkInfo().isConnected;
  const navigation = useNavigation();
  return (
    <>
      <View flexDirection={'row'} alignItems={'center'} paddingTop={0}>
        <Pressable onPress={() => navigation.goBack()}>
          <MaterialIcons
            name="arrow-back"
            size={30}
            color="black"
            style={styles.icon}
          />
        </Pressable>
        <View alignItems={'center'} flex={1} ml={4} flexDirection={'row'}>
          <Text color={'black'} fontSize={'3xl'} bold>
            {msg}
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
      </View>
    </>
  );
};

export default NavBar;

const styles = {
  icon: {
    marginLeft: 15,
  },
  wifi: {
    marginLeft: 15,
    color: '#2dbf52',
  },
  wifi_off: {
    marginLeft: 15,
    color: '#fc2b0c',
  },
};
