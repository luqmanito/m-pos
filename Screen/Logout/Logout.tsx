import React, {useState, useEffect} from 'react';
import {
  PresenceTransition,
  Button,
  Text,
  HStack,
  VStack,
  View,
} from 'native-base';

import {useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setPayments} from '../../Redux/Reducers/paymentMethod';
import {useDispatch} from 'react-redux';
import {clearCart} from '../../Redux/Reducers/cart';
import {clearStateButton} from '../../Redux/Reducers/button';
import {clearStateVisited} from '../../Redux/Reducers/isProductVisited';
import {clearOrderState} from '../../Redux/Reducers/orders';
import {useTranslation} from 'react-i18next';
import {useAuth} from '../../Contexts/Auth';

type LogoutScreenProps = {
  navigation: any;
};

export const LogoutScreen: React.FC<LogoutScreenProps> = ({navigation}) => {
  const isFocused = useIsFocused();
  const authContext = useAuth();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const {t} = useTranslation();
  const handleSubmit = async () => {
    try {
      navigation.navigate('LoginScreen');
      dispatch(setPayments([]));
      dispatch(clearCart());
      dispatch(clearStateButton());
      dispatch(clearOrderState());
      dispatch(clearStateVisited());
      const keys = await AsyncStorage.getAllKeys();
      await AsyncStorage.multiRemove(keys);
      authContext.signOut();
    } catch (error) {
      console.log('Error removing item from AsyncStorage:', error);
    }
  };
  const handleCancel = async () => {
    navigation.goBack();
  };

  useEffect(() => {
    setIsOpen(false);
    if (isFocused) {
      setIsOpen(true);
    }
  }, [isFocused]);

  return (
    <>
      <View justifyContent={'center'} alignItems={'center'} flex="1">
        <PresenceTransition
          visible={isOpen}
          initial={{
            opacity: 0,
            scale: 0,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            transition: {
              duration: 250,
            },
          }}>
          <View justifyContent={'center'} alignItems={'center'}>
            <Text fontSize={'xl'}>{t('logout-msg')}</Text>
          </View>
          <VStack mt={4} justifyContent={'center'} alignItems={'center'}>
            <HStack space={4}>
              <Button
                w={75}
                size={'lg'}
                bgColor={'#f9316b'}
                onPress={() => handleSubmit()}>
                {t('yes')}
              </Button>
              <Button
                w={75}
                size={'lg'}
                colorScheme={'info'}
                onPress={() => handleCancel()}>
                {t('no')}
              </Button>
            </HStack>
          </VStack>
        </PresenceTransition>
      </View>
    </>
  );
};
