import React, {useContext} from 'react';
import {View, Text, Pressable, Button} from 'native-base';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NavBar from '../../Components/Navbar/Navbar';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {PrimaryColorContext} from '../../Context';
import useEmployee from '../../Hooks/useEmployee';

const EmployeeSettings = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const {listEmployee} = useEmployee();
  const primaryColor = useContext(PrimaryColorContext);

  return (
    <>
      <NavBar msg="Pegawai" />
      {listEmployee.map((item: any) => {
        return (
          <View key={item?.id} mx={4} mt={4}>
            <Pressable
              bg={'white'}
              borderRadius={10}
              onPress={() => navigation.navigate('EmployeeDetail', item?.id)}>
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
                  <Text>{item?.role}</Text>
                </View>
                <View justifyContent={'center'} alignItems={'center'} mr={4}>
                  <AntDesign
                    name="right"
                    size={15}
                    color={primaryColor?.primaryColor}
                  />
                </View>
              </View>
            </Pressable>
          </View>
        );
      })}
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
