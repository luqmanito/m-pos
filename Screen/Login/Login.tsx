import React, {useState} from 'react';
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
import {useDispatch} from 'react-redux';
import {setPayments} from '../../Redux/Reducers/paymentMethod';
import {clearCart} from '../../Redux/Reducers/cart';
import {clearStateButton} from '../../Redux/Reducers/button';
import {clearStateVisited} from '../../Redux/Reducers/isProductVisited';
import {useAuth} from '../../Contexts/Auth';
import Role from '../../Consts/Role';
import BaseInput from '../../Components/Form/BaseInput';
import Container from '../../Components/Layout/Container';
import BaseButton from '../../Components/Button/BaseButton';
import useAlert from '../../Hooks/useAlert';

type LoginScreenProps = {
  navigation: any; // If you are using react-navigation, replace any with the correct navigation type
};

const LoginScreen: React.FC<LoginScreenProps> = ({navigation}) => {
  const [show, setShow] = useState(false);
  const alert = useAlert();
  const dispatch = useDispatch();
  dispatch(setPayments([]));
  dispatch(clearCart());
  dispatch(clearStateButton());
  dispatch(clearStateVisited());

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
        if (
          authData.user.role === Role.KITCHEN ||
          authData.user.role === Role.CASHIER
        ) {
          navigation.navigate('KitchenScreen');
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

  return (
    <Container>
      <ScrollView>
        <Center my={4}>
          <Image source={bg_small} resizeMode="contain" alt="logo-login" />
        </Center>
        <Center>
          <Text fontSize="md" bold>
            Hai, Apa Kabar Hari Ini ?
          </Text>
          <Text mt={2} fontSize="sm">
            Yuk, masuk dan mulai kejar cuan lagi.
          </Text>

          <BaseInput
            inputKey={'email'}
            isRequired={true}
            label={'Email'}
            keyboardType={'email-address'}
            placeholder={'example: ez@ezpos.id'}
            type={'text'}
            warningMessage={'Silakan Isi Email Anda.'}
            onChangeText={text => handleChange('email', text)}
          />
          <BaseInput
            inputKey={'password'}
            isRequired={true}
            label={'Password'}
            type={show ? 'text' : 'password'}
            placeholder="Masukkan Password"
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
            Lupa Password ?
          </Text>
        </Pressable>
        <View w={'100%'} mt={4}>
          <BaseButton
            onPress={handleSubmit}
            type={'primary'}
            label={'Masuk'}
            isDisabled={!auth?.email || !auth?.password}
          />
        </View>
        <View w={'100%'} my={4}>
          <BaseButton
            onPress={() => navigation.navigate('RegisterScreen')}
            type={'primary'}
            label={'Daftar Merchant'}
          />
        </View>
      </ScrollView>
    </Container>
  );
};

export default LoginScreen;
