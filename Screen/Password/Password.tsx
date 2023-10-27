import React, {useState, useEffect, useContext} from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import pass from '../../Public/Assets/pass.png';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import AuthNetwork from '../../Network/lib/auth';
import {useSelector} from 'react-redux';
import {
  Center,
  Image,
  Box,
  FormControl,
  Input,
  Button,
  useToast,
  Text,
  Pressable,
  Stack,
  Icon,
  View,
  WarningOutlineIcon,
} from 'native-base';
import {RootState} from '../../Redux/store';
import ToastAlert from '../../Components/Toast/Toast';
import {PrimaryColorContext} from '../../Context';

type PasswordScreenProps = {
  navigation: any; // If you are using react-navigation, replace any with the correct navigation type
};

const {height} = Dimensions.get('window');
export const PasswordScreen: React.FC<PasswordScreenProps> = ({navigation}) => {
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [strongPassword, setStrongPassword] = useState(false);
  const [show, setShow] = React.useState(false);
  const toast = useToast();
  const emailUser = useSelector((state: RootState) => state.authSlice?.email);
  const otpCode = useSelector((state: RootState) => state.authSlice?.code);

  function isStrongPassword(input: string): void {
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (passwordPattern.test(input) === true) {
      setStrongPassword(true);
    } else {
      setStrongPassword(false);
    }
  }
  const primaryColor = useContext(PrimaryColorContext);
  useEffect(() => {
    if (newPassword.length > 0) {
      isStrongPassword(newPassword);
    } else {
      setStrongPassword(true);
    }
  }, [newPassword]);

  const handleSubmit = async () => {
    if (newPassword === '' || confirmPassword === '') {
    } else {
      setIsLoading(true);
      try {
        const response = await AuthNetwork.passwordReset({
          email: emailUser,
          password: newPassword,
          password_confirmation: confirmPassword,
          code: otpCode,
        });
        if (response) {
          setIsLoading(false);
          navigation.navigate('LoginScreen');
          ToastAlert(toast, 'sukses', 'Password Berhasil Diubah');
        }
      } catch (error: any) {
        ToastAlert(toast, 'error', error?.response?.data?.errors?.password);
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <Center mb={-8} h={'40%'}>
        <Image
          source={pass}
          style={styles.image}
          width={'90%'}
          resizeMode="contain"
          alt="logo-pemkab"
        />
      </Center>
      <Center>
        <Text fontSize="md" bold>
          Perbarui Password-mu Dulu, Yuk
        </Text>
        <Text mt={2} fontSize="sm">
          Setelah diperbarui jangan sampai lupa, ya.
        </Text>

        <Box w="100%" mt={30} alignItems="center">
          <FormControl
            isInvalid={strongPassword === false ? true : false}
            isRequired>
            <Stack mx="4">
              <FormControl.Label>Password Baru</FormControl.Label>
              <Input
                onChangeText={text => setNewPassword(text)}
                type={show ? 'text' : 'password'}
                placeholder="Masukkan Password Baru"
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
        </Box>
        <Box w="100%" marginTop={4} alignItems="center">
          <FormControl isRequired>
            <Stack mx="4">
              <FormControl.Label>Konfirmasi Password</FormControl.Label>
              <Input
                onChangeText={text => setConfirmPassword(text)}
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
            </Stack>
          </FormControl>
        </Box>
      </Center>

      <Center h={300}>
        <View position={'absolute'} bottom={10} w={'90%'}>
          <Button
            borderRadius={34}
            isDisabled={!newPassword || !confirmPassword ? true : false}
            onPress={handleSubmit}
            isLoading={isLoading ? true : false}
            isLoadingText="Loading"
            w={'100%'}
            marginTop={5}
            bg={primaryColor?.primaryColor}>
            <Text fontSize={'md'} color="white">
              <Entypo name="check" size={15} color="white" /> Perbarui Password
            </Text>
          </Button>
        </View>
      </Center>
    </>
  );
};

const styles = StyleSheet.create({
  image: {
    top: 10,
  },
  text: {
    position: 'absolute',
    bottom: 0,
    fontSize: 14,
    color: 'black',
    height: height * 0.162,
  },
  text2: {
    position: 'absolute',
    bottom: 0,
    fontSize: 14,
    color: 'black',
    height: height * 0.13,
  },
  textCiamis: {
    position: 'absolute',
    bottom: 0,
    fontSize: 14,
    color: 'black',
    height: height * 0.1,
  },
});
