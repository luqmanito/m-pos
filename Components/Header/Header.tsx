import React, {useContext} from 'react';

import {View, Text} from 'native-base';
import {StyleSheet} from 'react-native';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import noImage from '../../Public/Assets/no-Image.jpg';
import {PrimaryColorContext} from '../../Context';
import FastImage from 'react-native-fast-image';
import {useAuth} from '../../Contexts/Auth';

const HeaderComponent: React.FC = () => {
  const {authData} = useAuth();
  const navigation = useNavigation<NavigationProp<any>>();
  const primaryColor = useContext(PrimaryColorContext);

  if (!authData) {
    return null;
  }
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
          {authData.user.business.photo &&
          authData.user.business.photo.length > 0 ? (
            <View mr={2} overflow={'hidden'}>
              <FastImage
                style={styles.image}
                source={{
                  uri: authData.user.business.photo[0].original_url,
                  priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.contain}
                fallback={noImage}
              />
            </View>
          ) : null}
          <Text color={'white'} fontSize={'lg'} bold>
            {authData.user.business.name}
          </Text>
        </View>

        <View flexDirection={'row'}>
          {/* <FontAwesome
            onPress={() => navigation.navigate('NotificationScreen')}
            name="bell"
            size={24}
            color="#fff"
            style={styles.icon}
          /> */}
          <FontAwesome
            onPress={() => navigation.navigate('SettingScreen')}
            name="gear"
            size={24}
            color="#fff"
            style={styles.icon}
          />
        </View>
      </View>

      <View
        zIndex={-1}
        h={92}
        overflow="hidden"
        bg={primaryColor?.primaryColor}
      />
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
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'white',
    // flex: 1,
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

export default HeaderComponent;
