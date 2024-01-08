import React, {useEffect, useState} from 'react';
import bg_small from '../../Public/Assets/bg_small.png';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  Center,
  Image,
  Text,
  Pressable,
  Icon,
  View,
  ScrollView,
} from 'native-base';
import {useAuth} from '../../Contexts/Auth';
import Role from '../../Consts/Role';
import BaseInput from '../../Components/Form/BaseInput';
import Container from '../../Components/Layout/Container';
import BaseButton from '../../Components/Button/BaseButton';
import useAlert from '../../Hooks/useAlert';
import indonesia from '../../Public/Assets/indonesia.png';
import british from '../../Public/Assets/british.png';
import {useTranslation} from 'react-i18next';
import i18next from '../../services/i18next';
import {useLoading} from '../../Context';
import LanguageModal from '../../Components/Language/LanguageModal';

type LoginScreenProps = {
  navigation: any;
};

const LoginScreen: React.FC<LoginScreenProps> = ({navigation}) => {
  const {t} = useTranslation();
  const [show, setShow] = useState(false);
  const alert = useAlert();
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const {loading} = useLoading();
  const [auth, setAuth] = useState({
    email: '',
    password: '',
  });
  const handleChange = (name: string, value: string) => {
    setAuth(prevAuth => ({
      ...prevAuth,
      [name]: value,
    }));
  };

  const authContext = useAuth();

  const handleSubmit = () => {
    authContext.signIn(auth.email, auth.password).then(authData => {
      if (authData) {
        if (authData.user.role === Role.KITCHEN) {
          navigation.navigate('KitchenScreen');
        } else if (authData.user.role === Role.CASHIER) {
          navigation.navigate('TellerScreen');
        } else if (
          authData.user.role === Role.USER ||
          authData.user.role === Role.ADMIN
        ) {
          navigation.navigate('Dashboard', {screen: 'Home'});
        }
      } else {
        alert.showAlert('warning', 'Check your email or password');
      }
    });
  };
  const currentLanguage = i18next.language;

  const [lang, setLang] = useState(
    i18next.language === 'ina' ? indonesia : british,
  );
  const [langKey, setLangKey] = useState(i18next.language);
  useEffect(() => {
    setLang(i18next.language === 'ina' ? indonesia : british);
    setLangKey(i18next.language);
  }, [currentLanguage]);

  return (
    <Container>
      <ScrollView>
        <View my={4} position="relative">
          <Center>
            <Image source={bg_small} resizeMode="contain" alt="logo-login" />
          </Center>
          <Pressable
            flexDir={'row'}
            onPress={() => setLanguageModalVisible(true)}
            justifyContent={'center'}
            alignItems={'center'}
            position={'absolute'}
            right={0}>
            <Text mr={4}>{currentLanguage === 'en' ? 'EN' : 'INA'}</Text>
            <Image
              top={0}
              source={lang}
              alt={'icon'}
              w={10}
              h={10}
              resizeMode="contain"
              key={langKey}
            />
          </Pressable>
        </View>
        <Center>
          <Text fontSize="md" bold>
            {t('welcome_msg')}
          </Text>
          <Text mt={2} fontSize="sm">
            {t('login-motto')}
          </Text>
          <BaseInput
            inputKey={'email'}
            isRequired={true}
            label={'Email'}
            keyboardType={'email-address'}
            placeholder={t('example-mail')}
            type={'text'}
            warningMessage={t('warn-email')}
            onChangeText={text => handleChange('email', text)}
          />
          <BaseInput
            inputKey={'password'}
            isRequired={true}
            label={'Password'}
            type={show ? 'text' : 'password'}
            placeholder={t('enter-pwd')}
            warningMessage={'Atleast 6 characters are required.'}
            onChangeText={text => handleChange('password', text)}
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
        </Center>
        <Pressable onPress={() => navigation.navigate('ForgotScreen')}>
          <Text mx={4} textAlign={'right'} color={'blue.900'} bold mt={4}>
            {t('forgot')}
          </Text>
        </Pressable>
        <View w={'100%'} mt={4}>
          <BaseButton
            onPress={handleSubmit}
            type={'primary'}
            label={t('login')}
            isLoading={loading}
            isDisabled={!auth?.email || !auth?.password}
          />
        </View>
        <View w={'100%'} my={4}>
          <BaseButton
            onPress={() => navigation.navigate('RegisterScreen')}
            type={'primary'}
            label={t('register')}
          />
        </View>
      </ScrollView>
      <LanguageModal
        visible={languageModalVisible}
        onClose={() => setLanguageModalVisible(false)}
      />
    </Container>
  );
};

export default LoginScreen;
