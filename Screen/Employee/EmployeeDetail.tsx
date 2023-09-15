import React, {useState} from 'react';
import {
  View,
  Text,
  Pressable,
  Divider,
  ScrollView,
  FormControl,
  Stack,
  Input,
  Radio,
  Icon,
  Button,
} from 'native-base';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NavBar from '../../Components/Navbar/Navbar';
import useUserInfo from '../../Hooks/useUserInfo';
import useDataEmployee from '../../Hooks/useDataEmployee';
import {useDispatch} from 'react-redux';
import {setNewEmployee} from '../../Redux/Reducers/employee';
import cache from '../../Util/cache';

const EmployeeDetail = ({navigation}) => {
  const {userData} = useUserInfo();
  const {dataDetailEmployee} = useDataEmployee();
  const dispatch = useDispatch();
  console.log('ee', dataDetailEmployee);
  const [dataEmployee, setDataEmployee] = useState({
    name: null,
    mobile_number: null,
    email: null,
    role: null || '',
  });
  const isEmpty = Object.values(dataEmployee).some(
    value => value === null || value === '',
  );
  const handleChange = (key: string, data: string) => {
    setDataEmployee(prev => ({
      ...prev,
      [key]: data,
    }));
  };

  const submitNewEmployee = async () => {
    const response = await cache.store('newEmployeeData', [dataEmployee]);
    return response;
  };
  return (
    <>
      <NavBar msg="Ubah Data Pegawai" />

      <ScrollView>
        <View mx={4}>
          <FormControl mt={4} isRequired>
            <Stack mx="4">
              <FormControl.Label>Nama Lengkap</FormControl.Label>
              <Input
                value={dataDetailEmployee[0]?.name}
                borderRadius={10}
                bg={'white'}
                onChangeText={text => handleChange('name', text)}
                placeholder="Contoh: Suprapto"
              />
            </Stack>
          </FormControl>
          <FormControl mt={4} isRequired>
            <Stack mx="4">
              <FormControl.Label>No Handphone</FormControl.Label>
              <Input
                isDisabled={true}
                isReadOnly={true}
                value={dataDetailEmployee[0]?.mobile_number}
                borderRadius={10}
                bg={'white'}
                onChangeText={text => handleChange('mobile_number', text)}
                keyboardType={'number-pad'}
                placeholder="Contoh: 0812345678"
              />
            </Stack>
          </FormControl>
          <FormControl mt={4} isRequired>
            <Stack mx="4">
              <FormControl.Label>Alamat Email</FormControl.Label>
              <Input
                isDisabled={true}
                isReadOnly={true}
                value={dataDetailEmployee[0]?.email}
                borderRadius={10}
                bg={'white'}
                onChangeText={text => handleChange('email', text)}
                placeholder="Contoh: suprapto@gmail.com"
              />
            </Stack>
          </FormControl>
          <FormControl mt={4} isRequired>
            <Stack mx="4">
              <FormControl.Label>Peran Pegawai</FormControl.Label>
              <Pressable
                onPress={() => handleChange('role', 'one')}
                mt={4}
                borderRadius={10}
                p={2}
                bg={'white'}>
                <View>
                  <Radio.Group
                    onChange={() => {
                      handleChange('role', 'one');
                    }}
                    name="myRadioGroup"
                    accessibilityLabel="favorite number"
                    value={'one'}>
                    <Radio
                      icon={
                        <Icon
                          as={
                            <AntDesign
                              name="checkcircle"
                              size={15}
                              color="white"
                            />
                          }
                        />
                      }
                      colorScheme={'blue'}
                      // value={dataDetailEmployee[0]?.role}
                      value={
                        dataEmployee?.role.toString() ||
                        dataDetailEmployee[0]?.role
                      }
                      my={1}>
                      Admin
                    </Radio>
                  </Radio.Group>
                </View>
                <Text ml={8}>
                  Dapat melakukan manajemen katalog, melihat semua laporan
                  transaksi dan mengatur akses pegawai.
                </Text>
              </Pressable>
              <Pressable
                onPress={() => handleChange('role', 'two')}
                mt={4}
                borderRadius={10}
                p={2}
                bg={'white'}>
                <View>
                  <Radio.Group
                    onChange={() => {
                      handleChange('role', 'two');
                    }}
                    name="myRadioGroup"
                    accessibilityLabel="favorite number"
                    value={'two'}>
                    <Radio
                      icon={
                        <Icon
                          as={
                            <AntDesign
                              name="checkcircle"
                              size={15}
                              color="white"
                            />
                          }
                        />
                      }
                      colorScheme={'blue'}
                      // value={dataDetailEmployee[0]?.role}
                      value={
                        dataEmployee?.role.toString() ||
                        dataDetailEmployee[0]?.role
                      }
                      my={1}>
                      User
                    </Radio>
                  </Radio.Group>
                </View>
                <Text ml={8}>
                  Terbatas hanya dapat melakukan transaksi dan lihat laporan
                  pendapatan.
                </Text>
              </Pressable>
            </Stack>
          </FormControl>
        </View>
      </ScrollView>

      <View
        p={2}
        position={'absolute'}
        alignSelf="center"
        w={'100%'}
        bottom={18}>
        <Button
          isDisabled={isEmpty}
          isLoadingText={'loading'}
          borderRadius={20}
          bg={'#0c50ef'}
          onPress={() => {
            submitNewEmployee();
            dispatch(setNewEmployee(dataEmployee));
            navigation.navigate('NewEmployee');
          }}>
          <Text
            bold
            fontSize={'xl'}
            textAlign={'center'}
            color="white"
            flex={2}>
            Simpan Perubahan
          </Text>
        </Button>
        <Button
          mt={4}
          // isDisabled={isEmpty}
          isLoadingText={'loading'}
          borderRadius={20}
          bg={'#fadedb'}
          onPress={() => {
            submitNewEmployee();
            dispatch(setNewEmployee(dataEmployee));
            navigation.navigate('NewEmployee');
          }}>
          <Text
            bold
            fontSize={'xl'}
            textAlign={'center'}
            color="#e14f4c"
            flex={2}>
            Hapus Pegawai
          </Text>
        </Button>
      </View>
    </>
  );
};

export default EmployeeDetail;
