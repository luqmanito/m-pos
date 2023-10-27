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

type LogoutScreenProps = {
  navigation: any;
};

export const LogoutScreen: React.FC<LogoutScreenProps> = ({navigation}) => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

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
            <Text fontSize={'xl'}>Apakah Anda Yakin Akan Keluar ?</Text>
          </View>
          <VStack mt={4} justifyContent={'center'} alignItems={'center'}>
            <HStack space={4}>
              <Button
                w={75}
                size={'lg'}
                bgColor={'#f9316b'}
                onPress={() => handleSubmit()}>
                Ya
              </Button>
              <Button
                w={75}
                size={'lg'}
                colorScheme={'info'}
                // colorScheme={'#'}
                onPress={() => handleCancel()}>
                Tidak
              </Button>
            </HStack>
          </VStack>
        </PresenceTransition>
      </View>
    </>
  );
};
