import React, {useEffect, useState} from 'react';
import {View, Text, Pressable, Button} from 'native-base';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';

import NavBar from '../../Components/Navbar/Navbar';
import useUserInfo from '../../Hooks/useUserInfo';
import cache from '../../Util/cache';
import {useIsFocused} from '@react-navigation/native';

const EmployeeSettings = ({navigation}) => {
  const isFocused = useIsFocused();
  const [dataEmployee, setDataEmployee] = useState([]);
  useEffect(() => {
    const NewEmployee = async () => {
      const response = await cache.get('newEmployeeData');
      if (response) {
        setDataEmployee(response);
      }
      console.log(response);
    };
    if (isFocused) {
      NewEmployee();
    }
  }, [isFocused]);

  const {userData} = useUserInfo();
  return (
    <>
      <NavBar msg="Pegawai" />
      <View mx={4} mt={4}>
        <Pressable
          bg={'white'}
          borderRadius={10}
          onPress={() => navigation.navigate('AdminDetail')}>
          <View my={4} mx={4} flexDirection={'row'}>
            <View justifyContent={'center'} alignItems={'flex-start'} ml={4}>
              <View bg={'blue.300'} p={2} borderRadius={8}>
                <Ionicons name="people" size={15} color="black" />
              </View>
            </View>
            <View ml={4} flex={8}>
              <Text bold>{userData?.name}</Text>
              <Text>{userData?.role}</Text>
            </View>
            <View justifyContent={'center'} alignItems={'center'} mr={4}>
              <AntDesign name="right" size={15} color="#0c50ef" />
            </View>
          </View>
        </Pressable>
      </View>
      {dataEmployee
        ? dataEmployee.map((item: any) => {
            return (
              <View key={item?.mobile_number} mx={4} mt={4}>
                <Pressable
                  bg={'white'}
                  borderRadius={10}
                  onPress={() => navigation.navigate('EmployeeDetail')}>
                  <View my={4} mx={4} flexDirection={'row'}>
                    <View
                      justifyContent={'center'}
                      alignItems={'flex-start'}
                      ml={4}>
                      <View bg={'blue.300'} p={2} borderRadius={8}>
                        <Ionicons name="people" size={15} color="black" />
                      </View>
                    </View>
                    <View ml={4} flex={8}>
                      <Text bold>{item?.name}</Text>
                      <Text>{item?.role === 'one' ? 'Admin' : 'User'}</Text>
                    </View>
                    <View
                      justifyContent={'center'}
                      alignItems={'center'}
                      mr={4}>
                      <AntDesign name="right" size={15} color="#0c50ef" />
                    </View>
                  </View>
                </Pressable>
              </View>
            );
          })
        : null}
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
          onPress={() => navigation.navigate('AddEmployee')}>
          <Text
            bold
            fontSize={'xl'}
            textAlign={'center'}
            color="white"
            flex={2}>
            Tambah Pegawai
          </Text>
        </Button>
      </View>
    </>
  );
};

export default EmployeeSettings;
