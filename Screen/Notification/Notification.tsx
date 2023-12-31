import {Button, Image, Text, View} from 'native-base';
import React, {useContext, useState} from 'react';
import NavBar from '../../Components/Navbar/Navbar';
import Entypo from 'react-native-vector-icons/Entypo';
import pushNotif from '../../Public/Assets/push-notif.jpg';
import {PrimaryColorContext} from '../../Context';
import formattedDate from '../../Util/Date/Today';
import formattedTime from '../../Util/Time/TimeNow';
import {useTranslation} from 'react-i18next';
const NotificationScreen = () => {
  const [activeMethod, setActiveMethod] = useState('method1');
  const {t} = useTranslation();
  const primaryColor = useContext(PrimaryColorContext);
  return (
    <>
      <NavBar msg="Notifikasi" />
      <View mt={4} flexDirection={'row'}>
        <View flex={1}>
          <Button
            bg={'transparent'}
            _text={
              activeMethod === 'method1'
                ? {
                    color: primaryColor?.primaryColor,
                  }
                : {
                    color: '#1F2937',
                  }
            }
            onPress={() => setActiveMethod('method1')}
            variant="unstyled"
            borderBottomColor={
              activeMethod === 'method1' ? primaryColor?.primaryColor : null
            }
            borderBottomWidth={activeMethod === 'method1' ? 2 : 0}
            textAlign={'center'}>
            {t('all')}
          </Button>
        </View>
        <View flex={1}>
          <Button
            bg={'transparent'}
            _text={
              activeMethod === 'method2'
                ? {
                    color: primaryColor?.primaryColor,
                  }
                : {
                    color: '#1F2937',
                  }
            }
            onPress={() => setActiveMethod('method2')}
            variant="unstyled"
            borderBottomColor={
              activeMethod === 'method2' ? primaryColor?.primaryColor : null
            }
            borderBottomWidth={activeMethod === 'method2' ? 2 : 0}
            textAlign={'center'}>
            {t('transaction')}
          </Button>
        </View>
        <View flex={1}>
          <Button
            bg={'transparent'}
            _text={
              activeMethod === 'method3'
                ? {
                    color: primaryColor?.primaryColor,
                  }
                : {
                    color: '#1F2937',
                  }
            }
            onPress={() => setActiveMethod('method3')}
            variant="unstyled"
            borderBottomColor={
              activeMethod === 'method3' ? primaryColor?.primaryColor : null
            }
            borderBottomWidth={activeMethod === 'method3' ? 2 : 0}
            textAlign={'center'}>
            {t('msg')}
          </Button>
        </View>
      </View>
      {activeMethod === 'method1' ? (
        <Text mx={4} mt={4} bold fontSize={'lg'}>{`${formattedDate}`}</Text>
      ) : null}

      {activeMethod === 'method1' ? (
        <View borderRadius={10} mt={4} bg={'white'} mx={4}>
          <View flexDirection={'row'} mx={4} mt={2}>
            <View flex={1} justifyContent={'center'}>
              <Entypo
                name="info-with-circle"
                size={20}
                color={primaryColor?.primaryColor}
              />
            </View>
            <View flex={8} justifyContent={'center'}>
              <Text color={'#b0b4d8'}>Info</Text>
            </View>
            <View flex={3} justifyContent={'center'}>
              <Text color={'#b0b4d8'} alignSelf={'flex-end'}>
                {formattedTime + ' WIB'}
              </Text>
            </View>
          </View>
          <View mb={2} flexDirection={'row'}>
            <View flex={1} />
            <Text flex={11} mx={4}>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit.
              Excepturi, tempore!
            </Text>
          </View>
        </View>
      ) : (
        <View
          bg={'white'}
          flex={1}
          position={'relative'}
          justifyContent={'center'}
          alignItems={'center'}>
          <Image
            source={pushNotif}
            w={300}
            resizeMode="contain"
            alt="logo-pemkab"
          />
          <Text position={'absolute'} color={'#b0b4d8'} bottom={200}>
            {t('no-notif')}
          </Text>
        </View>
      )}
    </>
  );
};

export default NotificationScreen;
