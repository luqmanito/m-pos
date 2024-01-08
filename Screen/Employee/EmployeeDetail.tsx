import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  FormControl,
  Stack,
  Radio,
  Icon,
} from 'native-base';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NavBar from '../../Components/Navbar/Navbar';
import {useLoading} from '../../Context';
import {RouteProp} from '@react-navigation/native';
import useEmployee from '../../Hooks/useEmployee';
import useRoles from '../../Hooks/useRoles';
import BaseInput from '../../Components/Form/BaseInput';
import {RootStackParamList} from '../../Navigation/RootStackParamList';
import DeleteEmployeeModal from './Components/DeleteEmployeeModal';
import BaseButton from '../../Components/Button/BaseButton';
import {useTranslation} from 'react-i18next';

type EmployeeDetailScreenProps = {
  route: RouteProp<RootStackParamList, 'ProductDetailsScreen'>;
};

const EmployeeDetail: React.FC<EmployeeDetailScreenProps> = ({route}) => {
  const {listRoles} = useRoles();
  const id = route?.params?.id === undefined ? null : route.params.id;
  const {loading} = useLoading();
  const [show, setShow] = useState(false);

  const {
    getDetailEmployee,
    handleChangeData,
    form,
    addEmployee,
    getFormError,
    isInvalid,
    clearFormErrors,
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
  const handleChange = (key: string, data: string) => {
    setDataEmployee(prev => ({
      ...prev,
      [key]: data,
    }));
  };
  const {t} = useTranslation();
  useEffect(() => {
    getDetailEmployee(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <NavBar msg={id ? t('change-employee') : t('add-employee')} />
      <ScrollView>
        <View mx={4}>
          <BaseInput
            inputKey={'name'}
            isRequired={true}
            label={t('fullname')}
            defaultValue={id ? form.name : ''}
            placeholder={t('ex-name')}
            type={'text'}
            isInvalid={isInvalid('name')}
            warningMessage={getFormError('name')}
            onChangeText={text => handleChangeData('name', text)}
          />
          <BaseInput
            inputKey={'email'}
            isRequired={true}
            label={t('email-address')}
            placeholder={t('example-mail')}
            defaultValue={id ? form.email : ''}
            type={'text'}
            isInvalid={isInvalid('email')}
            warningMessage={getFormError('email')}
            onChangeText={text => handleChangeData('email', text)}
          />
          {!id ? (
            <>
              <BaseInput
                inputKey={'password'}
                isRequired={true}
                label={'Password'}
                placeholder={'password'}
                type={show ? 'text' : 'password'}
                isInvalid={isInvalid('password')}
                warningMessage={getFormError('password')}
                onChangeText={text => handleChangeData('password', text)}
                rightIcon={
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
              <BaseInput
                inputKey={'password_confirmation'}
                isRequired={true}
                label={t('repeat-password')}
                placeholder={t('repeat-password')}
                type={show ? 'text' : 'password'}
                isInvalid={isInvalid('password_confirmation')}
                warningMessage={getFormError('password_confirmation')}
                onChangeText={text =>
                  handleChangeData('password_confirmation', text)
                }
                rightIcon={
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
            </>
          ) : null}

          <FormControl mt={4}>
            <Stack mx="4">
              <FormControl.Label>{t('employee-roles')}</FormControl.Label>
              {listRoles.map(role => {
                return (
                  <Pressable
                    key={role?.id}
                    onPress={() => {
                      handleChangeData('role', role.role);
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
          <BaseButton
            onPress={() => {
              clearFormErrors();
              id ? editEmployee(id) : addEmployee();
            }}
            isLoading={loading}
            size="xl"
            bold={true}
            type="primary"
            label={id ? t('save-changes') : t('add-employee')}
            borderRadius={20}
          />
          {id ? (
            <>
              <View mt={4}>
                <BaseButton
                  onPress={() => {
                    setIsOpen(true);
                  }}
                  isLoading={loading}
                  size="xl"
                  type="warning"
                  bold={true}
                  textColor="#e14f4c"
                  label={t('delete-employee')}
                  borderRadius={20}
                />
              </View>
            </>
          ) : null}
        </View>
      </ScrollView>
      <DeleteEmployeeModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        id={id}
      />
    </>
  );
};

export default EmployeeDetail;
