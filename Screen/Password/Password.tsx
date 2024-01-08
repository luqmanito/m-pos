import React, {useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AuthNetwork from '../../Network/lib/auth';
import {Center, Text, Pressable, Icon, View} from 'native-base';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../Navigation/RootStackParamList';
import {RouteProp} from '@react-navigation/native';
import Container from '../../Components/Layout/Container';
import BaseInput from '../../Components/Form/BaseInput';
import BaseButton from '../../Components/Button/BaseButton';
import useErrorHandler from '../../Hooks/useErrorHandler';
import useAlert from '../../Hooks/useAlert';
import {ErrorModel} from '../../models/ErrorModel';
import {useTranslation} from 'react-i18next';

type PasswordScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PasswordScreen'>;
  route: RouteProp<RootStackParamList, 'PasswordScreen'>;
};

const PasswordScreen: React.FC<PasswordScreenProps> = ({navigation, route}) => {
  const [confirmPassword, setConfirmPassword] = useState('');
  const {t} = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [show, setShow] = React.useState(false);
  const emailUser = route.params.email;
  const otpCode = route.params.otp;
  const {getFormError, clearFormErrors, setFormErrors, isInvalid} =
    useErrorHandler();
  const alert = useAlert();

  const handleSubmit = async () => {
    clearFormErrors();
    setIsLoading(true);
    AuthNetwork.passwordReset({
      email: emailUser,
      password: newPassword,
      password_confirmation: confirmPassword,
      code: otpCode,
    })
      .then(() => {
        alert.showAlert('success', t('pwd-success'));
        navigation.navigate('LoginScreen');
      })
      .catch(e => {
        const err: ErrorModel | undefined = e.response.data;
        setFormErrors(err);
        alert.showAlert('error', 'check your form');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <Container>
        <View mt={5}>
          <Center my={2}>
            <Text fontSize="md" bold>
              {t('pwd-change')}
            </Text>
            <Text mt={2} mb={4} fontSize="sm">
              {t('pwd-info')}
            </Text>
          </Center>
        </View>
        <BaseInput
          inputKey={'password'}
          isRequired={true}
          label={'Password'}
          placeholder={t('enter-pwd')}
          type={show ? 'text' : 'password'}
          isInvalid={isInvalid('password')}
          warningMessage={getFormError('password')}
          onChangeText={text => setNewPassword(text)}
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
          onChangeText={text => setConfirmPassword(text)}
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
        <BaseButton
          type={'primary'}
          mt={4}
          onPress={handleSubmit}
          isLoading={isLoading}
          isDisabled={isLoading}
          label={t('new-pwd')}
        />
      </Container>
    </>
  );
};
export default PasswordScreen;
