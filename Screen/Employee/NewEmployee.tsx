import React, {useContext} from 'react';
import {Button, Center, Text, View} from 'native-base';
import {useSelector} from 'react-redux';
import {RootState} from '../../Redux/store';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Foundation from 'react-native-vector-icons/Foundation';
import {PrimaryColorContext} from '../../Context';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

const NewEmployee = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const dataEmployee = useSelector(
    (state: RootState) => state.employeeSlice.dataEmployee,
  );
  const {t} = useTranslation();
  const primaryColor = useContext(PrimaryColorContext);
  return (
    <>
      <View mt={10} justifyContent={'center'} alignItems={'center'}>
        <AntDesign name="checkcircleo" size={105} color="#2cc051" />
      </View>
      <Center>
        <Text mt={4} fontSize={30}>
          {t('success-employee')}
        </Text>
        <Text mt={4} fontSize={15} color={'#abafcc'}>
          {t('success-employee-info')}
        </Text>
      </Center>
      <View mx={4} mt={4}>
        <View bg={'white'} borderRadius={10}>
          <View my={4} mx={4} flexDirection={'row'}>
            <View justifyContent={'center'} alignItems={'flex-start'} ml={4}>
              <View bg={'blue.300'} p={2} borderRadius={8}>
                <Ionicons name="people" size={40} color="black" />
              </View>
            </View>
            <View ml={4} flex={8}>
              <Text bold fontSize={'xl'}>
                {dataEmployee?.name}
              </Text>
              <Text bold>{dataEmployee?.role}</Text>
              <Text mt={2} color={'#abafcc'}>
                {dataEmployee?.email}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View mx={4} mt={4}>
        <View bg={'white'} borderRadius={10}>
          <View mt={4} flexDirection={'row'}>
            <View justifyContent={'center'} mx={4}>
              <Foundation
                name="info"
                size={25}
                color={primaryColor?.primaryColor}
              />
            </View>
            <View>
              <Text bold fontSize={'lg'}>
                {t('information')}
              </Text>
            </View>
          </View>
          <Text mx={4} mb={4} fontSize={'md'}>
            {t('employee-information')}
          </Text>
        </View>
      </View>
      <View
        p={2}
        position={'absolute'}
        alignSelf="center"
        w={'100%'}
        bottom={18}>
        <Button
          isLoadingText={'loading'}
          borderRadius={20}
          bg={primaryColor?.primaryColor}
          onPress={() => navigation.navigate('SettingScreen')}>
          <Text
            bold
            fontSize={'xl'}
            textAlign={'center'}
            color="white"
            flex={2}>
            Tutup
          </Text>
        </Button>
      </View>
    </>
  );
};

export default NewEmployee;
