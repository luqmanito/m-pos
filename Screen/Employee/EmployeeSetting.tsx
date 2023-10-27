import React, {useContext, useEffect} from 'react';
import {View, Text, Pressable, Button} from 'native-base';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';

import NavBar from '../../Components/Navbar/Navbar';
// import useUserInfo from '../../Hooks/useUserInfo';
// import cache from '../../Util/cache';
import {
  NavigationProp,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import {PrimaryColorContext} from '../../Context';
import useEmployee from '../../Hooks/useEmployee';

const EmployeeSettings = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const isFocused = useIsFocused();
  // const [dataEmployee, setDataEmployee] = useState([]);
  const {listEmployee} = useEmployee();

  const primaryColor = useContext(PrimaryColorContext);
  useEffect(() => {
    // const NewEmployee = async () => {
    //   const response = await cache.get('newEmployeeData');
    //   if (response) {
    //     setDataEmployee(response);
    //   }
    // };
    if (isFocused) {
      console.log(listEmployee);
    }
  }, [isFocused, listEmployee]);

  // const {userData} = useUserInfo();
  return (
    <>
      <NavBar msg="Pegawai" />
      {/* <View mx={4} mt={4}>
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
              <AntDesign
                name="right"
                size={15}
                color={primaryColor?.primaryColor}
              />
            </View>
          </View>
        </Pressable>
      </View> */}
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
