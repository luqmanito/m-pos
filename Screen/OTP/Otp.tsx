import React, {useState, useEffect} from 'react';
import AuthNetwork from '../../Network/lib/auth';
import {Center, Text, Pressable, IconButton, Icon, View} from 'native-base';
import Container from '../../Components/Layout/Container';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import BaseInput from '../../Components/Form/BaseInput';
import BaseButton from '../../Components/Button/BaseButton';
import useAlert from '../../Hooks/useAlert';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../../Navigation/RootStackParamList';
import {useTranslation} from 'react-i18next';

type OtpScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'OtpScreen'>;
  route: RouteProp<RootStackParamList, 'OtpScreen'>;
};

const OtpScreen: React.FC<OtpScreenProps> = ({navigation, route}) => {
  const [otp, setOtp] = useState('');
  const emailUser = route.params.email;
  const [isLoading, setIsLoading] = useState(false);
  const [counter, setCounter] = useState(60);
  const alert = useAlert();
  const {t} = useTranslation();
  function resendOtp(value: number): void {
    setCounter(value);
    handleSubmit();
  }

  const handleSubmit = async () => {
    try {
      await AuthNetwork.forgot({
        email: emailUser,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const checkOTP = () => {
    AuthNetwork.checkCode({
      email: emailUser,
      code: otp,
    })
      .then(() => {
        navigation.navigate('PasswordScreen', {
          email: emailUser,
          otp: otp,
        });
      })
      .catch(() => {
        alert.showAlert('error', t('wrong-otp'));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter(prevCounter => (prevCounter > 0 ? prevCounter - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const onClose = () => {
    navigation.navigate('ForgotScreen');
  };

  return (
    <>
      <Container>
        <View mt={5}>
          <Center my={2}>
            <Text fontSize="md" bold>
              {t('otp-title')}
            </Text>
            <Text mt={2} mb={4} fontSize="sm">
              {t('otp-info')}
            </Text>
          </Center>
          <IconButton
            icon={<Icon as={MaterialIcons} name="close" />}
            borderRadius="full"
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              padding: 8,
            }}
            onPress={onClose}
          />
        </View>
        <BaseInput
          inputKey={'email'}
          isRequired={true}
          label={t('otp-code')}
          type={'text'}
          keyboardType="number-pad"
          onChangeText={text => setOtp(text)}
        />
        <BaseButton
          type={'primary'}
          mt={4}
          onPress={checkOTP}
          isLoading={isLoading}
          label={t('submit')}
        />
        <Pressable mt={4} onPress={() => resendOtp(65)} disabled={counter > 0}>
          <Text color={'blue.900'}>
            {t('resend-otp')}{' '}
            {counter === 0
              ? t('resend-now')
              : `${t('resend-time')} ${counter} ${t('resend-second')}`}
          </Text>
        </Pressable>
      </Container>
    </>
  );
};
export default OtpScreen;
