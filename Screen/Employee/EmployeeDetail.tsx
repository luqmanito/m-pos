import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  FormControl,
  Stack,
  Input,
  Radio,
  Icon,
  Button,
  Center,
  Modal,
} from 'native-base';
import AntDesign from 'react-native-vector-icons/AntDesign';
// import Ionicons from 'react-native-vector-icons/Ionicons';
import NavBar from '../../Components/Navbar/Navbar';
// import useUserInfo from '../../Hooks/useUserInfo';
// import useDataEmployee from '../../Hooks/useDataEmployee';
import {useDispatch} from 'react-redux';
import {setNewEmployeeData} from '../../Redux/Reducers/employee';
import cache from '../../Util/cache';
import {PrimaryColorContext, useLoading} from '../../Context';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import useEmployee from '../../Hooks/useEmployee';
import {NavigationModel} from '../../models/NavModel';
import useRoles from '../../Hooks/useRoles';

const EmployeeDetail = (param: NavigationModel | {}) => {
  const {listRoles} = useRoles();
  const navigation = useNavigation<NavigationProp<any>>();
  const {loading} = useLoading();
  const primaryColor = useContext(PrimaryColorContext);
  const dispatch = useDispatch();
  const {
    getDetailEmployee,
    deleteEmployee,
    handleChangeData,
    editEmployee,
    detailEmployee,
  } = useEmployee();

  const [dataEmployee, setDataEmployee] = useState({
    name: null,
    mobile_number: null,
    email: null,
    role: null || '',
  });
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const isEmpty = Object.values(dataEmployee).some(
    value => value === null || value === '',
  );
  const handleChange = (key: string, data: string) => {
    setDataEmployee(prev => ({
      ...prev,
      [key]: data,
    }));
  };

  useEffect(() => {
    getDetailEmployee(param?.route?.params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <NavBar msg="Ubah Data Pegawai" />

      <ScrollView>
        <View mx={4}>
          <FormControl mt={4} isRequired>
            <Stack mx="4">
              <FormControl.Label>Nama Lengkap</FormControl.Label>
              <Input
                value={dataEmployee?.name || detailEmployee?.name}
                borderRadius={10}
                bg={'white'}
                onChangeText={text => {
                  handleChangeData({name: 'name', value: text});
                  handleChange('name', text);
                }}
                placeholder="Contoh: Suprapto"
              />
            </Stack>
          </FormControl>
          <FormControl mt={4} isRequired>
            <Stack mx="4">
              <FormControl.Label>Alamat Email</FormControl.Label>
              <Input
                isDisabled={true}
                isReadOnly={true}
                value={dataEmployee?.email || detailEmployee?.email}
                borderRadius={10}
                bg={'white'}
                onChangeText={text => {
                  handleChangeData({name: 'email', value: text});
                  handleChange('email', text);
                }}
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
                          // value={dataEmployee.role}
                          value={
                            dataEmployee?.role
                              ? dataEmployee?.role
                              : detailEmployee?.role === 'ADMIN'
                              ? 'admin'
                              : detailEmployee?.role === 'USER'
                              ? 'user'
                              : detailEmployee?.role === 'KITCHEN'
                              ? 'kitchen'
                              : 'cashier'
                          }
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
            // isDisabled={isEmpty}
            isLoadingText={'loading'}
            borderRadius={20}
            bg={primaryColor?.primaryColor}
            onPress={() => {
              editEmployee(param?.route?.params);
              // submitNewEmployee();
              // dispatch(setNewEmployeeData(dataEmployee));
              // navigation.navigate('NewEmployee');
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
            isLoadingText={'loading'}
            borderRadius={20}
            bg={'#fadedb'}
            onPress={() => {
              setIsOpen(true);
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
      </ScrollView>

      <Center>
        <Modal
          size={'lg'}
          isOpen={isOpen}
          onClose={() => {
            // setDeleteProduct(false);
            setIsOpen(false);
          }}>
          <Modal.Content mb={0} maxWidth="400px">
            <Modal.CloseButton />
            <Modal.Header>Hapus Pegawai</Modal.Header>
            <Text mx={4} mt={4}>
              'Apakah Anda yakin akan menghapus pegawai ini ?'
            </Text>
            <Modal.Body flexDirection={'row'}>
              <Button
                flex={1}
                mx={4}
                isLoading={loading}
                bg={'#ef4536'}
                onPress={() => {
                  deleteEmployee(param?.route?.params);
                }}>
                <Text color={'#fdecec'}>Ya</Text>
              </Button>
              <Button
                flex={1}
                bg={'#fdecec'}
                isLoading={loading}
                onPress={() => {
                  setIsOpen(false);
                }}>
                <Text color={'#ef4536'}>Tidak</Text>
              </Button>
            </Modal.Body>
          </Modal.Content>
        </Modal>
      </Center>
    </>
  );
};

export default EmployeeDetail;
