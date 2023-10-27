import React, {useContext, useEffect, useState} from 'react';
import {
  Button,
  FormControl,
  Icon,
  Input,
  Pressable,
  Radio,
  ScrollView,
  Stack,
  Text,
  View,
  WarningOutlineIcon,
} from 'native-base';
import NavBar from '../../Components/Navbar/Navbar';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import {useDispatch} from 'react-redux';
// import {setNewEmployee} from '../../Redux/Reducers/employee';
import cache from '../../Util/cache';
import {PrimaryColorContext, useLoading} from '../../Context';
// import useEmployee from '../../Hooks/useEmployee';
import usePassword from '../../Hooks/usePassword';
import useEmployee from '../../Hooks/useEmployee';
import useRoles from '../../Hooks/useRoles';
// import {NavigationProp, useNavigation} from '@react-navigation/native';
const AddEmployee = () => {
  const {loading} = useLoading();
  const primaryColor = useContext(PrimaryColorContext);
  const {handleChangeData, newEmployee, addEmployee} = useEmployee();
  const {isStrongPassword, strongPassword, setStrongPassword} = usePassword();
  const {listRoles} = useRoles();
  const [show, setShow] = useState(false);
  const [dataEmployee, setDataEmployee] = useState({
    name: null,
    mobile_number: null,
    email: null,
    role: null || '',
  });
  const isEmpty = Object.values(newEmployee).some(
    value => value === null || value === '',
  );
  const handleChange = (key: string, data: string) => {
    setDataEmployee(prev => ({
      ...prev,
      [key]: data,
    }));
  };

  useEffect(() => {
    if (newEmployee?.password.length > 0) {
      isStrongPassword(newEmployee?.password);
    } else {
      setStrongPassword(true);
    }
  }, [isStrongPassword, setStrongPassword, newEmployee?.password]);

  const submitNewEmployee = async () => {
    const response = await cache.store('newEmployeeData', [dataEmployee]);
    return response;
  };

  return (
    <>
      <NavBar msg="Tambah Pegawai" />
      <ScrollView>
        <View mx={4}>
          <FormControl mt={4} isRequired>
            <Stack mx="4">
              <FormControl.Label>Nama Lengkap</FormControl.Label>
              <Input
                borderRadius={10}
                bg={'white'}
                // onChangeText={text => handleChange('name', text)}
                onChangeText={text =>
                  handleChangeData({name: 'name', value: text})
                }
                placeholder="Contoh: Suprapto"
              />
            </Stack>
          </FormControl>
          <FormControl
            mt={4}
            isInvalid={strongPassword === false ? true : false}
            isRequired>
            <Stack mx="4">
              <FormControl.Label>Password</FormControl.Label>
              <Input
                bg={'white'}
                onChangeText={text =>
                  handleChangeData({name: 'password', value: text})
                }
                type={show ? 'text' : 'password'}
                placeholder="Masukkan Password"
                InputRightElement={
                  <Pressable onPress={() => setShow(!show)}>
                    <Icon
                      as={<Ionicons name={show ? 'eye' : 'eye-off'} />}
                      size={5}
                      mr="2"
                      color="muted.400"
                    />
                  </Pressable>
                }
              />
              {strongPassword === false ? (
                <FormControl.ErrorMessage
                  leftIcon={<WarningOutlineIcon size="xs" />}>
                  Min 8 karakter dengan kombinasi min 1 huruf kapital dan angka.
                </FormControl.ErrorMessage>
              ) : null}
            </Stack>
          </FormControl>
          <FormControl
            isInvalid={
              newEmployee.password_confirmation !== '' &&
              newEmployee?.password !== newEmployee?.password_confirmation
            }
            mt={4}
            isRequired>
            <Stack mx="4">
              <FormControl.Label>Konfirmasi Password</FormControl.Label>
              <Input
                onChangeText={text =>
                  handleChangeData({name: 'password_confirmation', value: text})
                }
                bg={'white'}
                type={show ? 'text' : 'password'}
                placeholder="Ulangi Password"
                InputRightElement={
                  <Pressable onPress={() => setShow(!show)}>
                    <Icon
                      as={<Ionicons name={show ? 'eye' : 'eye-off'} />}
                      size={5}
                      mr="2"
                      color="muted.400"
                    />
                  </Pressable>
                }
              />
              {newEmployee?.password !== newEmployee?.password_confirmation ? (
                <FormControl.ErrorMessage
                  leftIcon={<WarningOutlineIcon size="xs" />}>
                  Password tidak sama.
                </FormControl.ErrorMessage>
              ) : null}
            </Stack>
          </FormControl>
          <FormControl mt={4} isRequired>
            <Stack mx="4">
              <FormControl.Label>Alamat Email</FormControl.Label>
              <Input
                borderRadius={10}
                bg={'white'}
                // onChangeText={text => handleChange('email', text)}
                onChangeText={text =>
                  handleChangeData({name: 'email', value: text})
                }
                placeholder="Contoh: suprapto@gmail.com"
              />
            </Stack>
          </FormControl>
          <FormControl mt={4} isRequired>
            <Stack mx="4">
              <FormControl.Label>Peran Pegawai</FormControl.Label>
              {listRoles.map(role => {
                return (
                  <Pressable
                    key={role?.id}
                    onPress={() => {
                      handleChangeData({name: 'role', value: role.role});
                      handleChange('role', role?.value);
                    }}
                    mt={4}
                    borderRadius={10}
                    p={2}
                    bg={'white'}>
                    <View>
                      <Radio.Group
                        onChange={() => {
                          handleChange('role', role?.value);
                        }}
                        name="myRadioGroup"
                        accessibilityLabel="favorite number"
                        value={role?.value}>
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
                          value={dataEmployee.role}
                          my={1}>
                          {role?.title}
                        </Radio>
                      </Radio.Group>
                    </View>
                    <Text ml={8}>{role?.description}</Text>
                  </Pressable>
                );
              })}
            </Stack>
          </FormControl>
        </View>
        <View px={8} my={4} alignSelf="center" w={'100%'}>
          <Button
            isLoading={loading}
            isDisabled={isEmpty}
            isLoadingText={'loading'}
            borderRadius={20}
            bg={primaryColor?.primaryColor}
            onPress={() => {
              submitNewEmployee();
              addEmployee();
              // dispatch(setNewEmployee(dataEmployee));
              // navigation.navigate('NewEmployee');
            }}>
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
      </ScrollView>
    </>
  );
};

export default AddEmployee;
