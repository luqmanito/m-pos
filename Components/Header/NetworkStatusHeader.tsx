import React from 'react';
import {View, Text} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import useNetworkInfo from '../../Hooks/useNetworkInfo';

interface NetworkStatusHeaderProps {
  title: string;
}

const NetworkStatusHeader: React.FC<NetworkStatusHeaderProps> = ({title}) => {
  const isConnected = useNetworkInfo().isConnected;
  return (
    <View
      width={'100%'}
      flexDirection={'row'}
      my={4}
      justifyContent={'space-between'}
      alignItems={'center'}>
      <View flexDirection={'row'} alignItems={'center'}>
        <Text color={'black'} fontSize={'3xl'} bold>
          {title}
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
  );
};

const styles = {
  wifi: {
    marginLeft: 10,
    color: '#2dbf52',
  },
  wifi_off: {
    marginLeft: 10,
    color: '#fc2b0c',
  },
};

export default NetworkStatusHeader;
