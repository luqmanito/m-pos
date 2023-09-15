import React from 'react';
import {Button, Center, Text, View} from 'native-base';
import {useSelector} from 'react-redux';
import {RootState} from '../../Redux/store';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Foundation from 'react-native-vector-icons/Foundation';

const NewEmployee = ({navigation}) => {
  const dataEmployee = useSelector(
    (state: RootState) => state.employeeSlice.dataEmployee,
  );
  return (
    <>
      <View mt={10} justifyContent={'center'} alignItems={'center'}>
        <AntDesign name="checkcircleo" size={105} color="#2cc051" />
      </View>
      <Center>
        <Text mt={4} fontSize={30}>
          Pegawai Berhasil Ditambahkan
        </Text>
        <Text mt={4} fontSize={15} color={'#abafcc'}>
          Pegawaimu sudah bisa mengakses fitur-fitur Hidup Merchant.
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
              <Text bold>
                {dataEmployee?.role === 'one' ? 'Admin' : 'User'}
              </Text>
              <Text mt={2} color={'#abafcc'}>
                {dataEmployee?.mobile_number}
              </Text>
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
              <Foundation name="info" size={25} color="#0c50ef" />
            </View>
            <View>
              <Text bold fontSize={'lg'}>
                Informasi
              </Text>
            </View>
          </View>
          <Text mx={4} mb={4} fontSize={'md'}>
            Password sementara sudah dikirim ke email pegawaimu. Silakan minta
            pegawai bersangkutan untuk log in Hidup Merchant.
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
          bg={'#0c50ef'}
          onPress={() => navigation.navigate('EmployeeSettings')}>
          <Text
            bold
            fontSize={'xl'}
            textAlign={'center'}
            color="white"
            flex={2}>
            Lihat Daftar Pegawai
          </Text>
        </Button>
      </View>
    </>
  );
};

export default NewEmployee;
