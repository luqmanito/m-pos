import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import cashier from '../../Public/Assets/cashier.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AuthNetwork from '../../Network/lib/auth';
import {
  Center,
  Image,
  Box,
  FormControl,
  Input,
  Button,
  Text,
  Pressable,
  Stack,
  useToast,
  WarningOutlineIcon,
  Icon,
  View,
  KeyboardAvoidingView,
  ScrollView,
} from 'native-base';
import ToastAlert from '../../Components/Toast/Toast';

type LoginScreenProps = {
  navigation: any; // If you are using react-navigation, replace any with the correct navigation type
};

const LoginScreen: React.FC<LoginScreenProps> = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [auth, setAuth] = useState({
    email: '',
    password: '',
  });
  const toast = useToast();
  const handleChange = (name: string, value: string) => {
    setAuth(prevAuth => ({
      ...prevAuth,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await AuthNetwork.login({
        email: auth?.email,
        password: auth?.password,
      });
      if (response) {
        await AsyncStorage.setItem('authToken', response?.data?.token);
        setIsLoading(false);
        ToastAlert(toast, 'sukses', 'Berhasil Masuk');
        navigation.navigate('Dashboard', {screen: 'Home'});
      }
    } catch (error: any) {
      setIsLoading(false);
      console.log(error);

      ToastAlert(toast, 'error', error?.response?.data?.message);
      setIsLoading(false);
    }
  };

  return (
    <>
      <KeyboardAvoidingView>
        <ScrollView>
          <Center mb={-8} h={'40%'}>
            <Image
              source={cashier}
              style={styles.image}
              width={'90%'}
              resizeMode="contain"
              alt="logo-login"
            />
          </Center>
          <Center>
            <Text fontSize="md" bold>
              Hai, Apa Kabar Hari Ini ?
            </Text>
            <Text mt={2} fontSize="sm">
              Yuk, masuk dan mulai kejar cuan lagi.
            </Text>

            <Box w="100%" mt={4} alignItems="center">
              <FormControl isRequired>
                <Stack mx="4">
                  <FormControl.Label>Alamat Email</FormControl.Label>
                  <Input
                    onChangeText={text => handleChange('email', text)}
                    type="text"
                    placeholder="Contoh: budi@mail.com"
                  />
                  <FormControl.ErrorMessage
                    leftIcon={<WarningOutlineIcon size="xs" />}>
                    Silakan Isi Email Anda.
                  </FormControl.ErrorMessage>
                </Stack>
              </FormControl>
            </Box>
            <Box w="100%" marginTop={4} alignItems="center">
              <FormControl isRequired>
                <Stack mx="4">
                  <FormControl.Label>Password</FormControl.Label>
                  <Input
                    onChangeText={text => handleChange('password', text)}
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
                  <FormControl.ErrorMessage
                    leftIcon={<WarningOutlineIcon size="xs" />}>
                    Atleast 6 characters are required.
                  </FormControl.ErrorMessage>
                </Stack>
              </FormControl>
            </Box>
          </Center>
          <Pressable onPress={() => navigation.navigate('ForgotScreen')}>
            <Text mx={4} textAlign={'right'} color={'blue.900'} bold mt={4}>
              Lupa Password ?
            </Text>
          </Pressable>
          <Center h={250}>
            <View position={'absolute'} bottom={10} w={'90%'}>
              <Button
                borderRadius={34}
                isDisabled={!auth?.email || !auth?.password ? true : false}
                onPress={handleSubmit}
                isLoading={isLoading ? true : false}
                isLoadingText="Loading"
                w={'100%'}
                marginTop={5}
                bg={'#0c50ef'}>
                <Text fontSize={'md'} color="white">
                  <Entypo name="login" size={15} color="white" /> Masuk
                </Text>
              </Button>

              <Button
                borderRadius={34}
                onPress={() => navigation.navigate('RegisterScreen')}
                isLoadingText="Loading"
                w={'100%'}
                marginTop={5}
                bg={'#0c50ef'}>
                <Text fontSize={'md'} color="white">
                  <MaterialIcons
                    name="app-registration"
                    size={15}
                    color="white"
                  />{' '}
                  Daftar Merchant
                </Text>
              </Button>
            </View>
          </Center>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  image: {
    top: 10,
  },
});

export default LoginScreen;
