import React, {useState, useEffect} from 'react';
import AuthNetwork from '../../Network/lib/auth';
import {useSelector, useDispatch} from 'react-redux';
import {
  Center,
  Box,
  FormControl,
  Input,
  Text,
  Pressable,
  useToast,
  Stack,
  WarningOutlineIcon,
  HStack,
  Spinner,
  Heading,
} from 'native-base';
import {RootState} from '../../Redux/store';
import {setCode} from '../../Redux/Reducers/auth';
import ToastAlert from '../../Components/Toast/Toast';

type OtpScreenProps = {
  navigation: any;
};

export const OtpScreen: React.FC<OtpScreenProps> = ({navigation}) => {
  const [otp, setOtp] = useState('');
  const emailUser = useSelector((state: RootState) => state.authSlice?.email);
  const [isLoading, setIsLoading] = useState(false);
  const [counter, setCounter] = useState(5);
  const dispatch = useDispatch();
  const toast = useToast();
  function resendOtp(value: number): void {
    setCounter(value);
    handleSubmit();
  }

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await AuthNetwork.forgot({
        email: emailUser,
      });
      if (response) {
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter(prevCounter => (prevCounter > 0 ? prevCounter - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const validationCheck = async () => {
      setIsLoading(true);
      try {
        const response = await AuthNetwork.checkCode({
          email: emailUser,
          code: otp,
        });
        if (response) {
          setIsLoading(false);
          dispatch(setCode(otp));
          navigation.navigate('PasswordScreen');
        }
      } catch (error) {
        ToastAlert(toast, 'error', 'Kode OTP Salah!');
        console.log(error);
        setIsLoading(false);
      }
    };
    if (otp.length === 6) {
      validationCheck();
    }
  }, [otp, dispatch, toast, emailUser, navigation]);

  return (
    <>
      <Center top={20}>
        <Text fontSize="md" bold>
          Masukkan Kode OTP
        </Text>
        <Text
          numberOfLines={2}
          textAlign={'center'}
          mx={4}
          mt={2}
          fontSize="sm">
          Kami sudah mengirimkan Email berisi kode OTP ke alamat email-mu.
        </Text>

        <Box w="100%" mt={30} alignItems="center">
          <FormControl isRequired>
            <Stack mx="4">
              <FormControl.Label>Kode OTP</FormControl.Label>
              <Input
                onChangeText={text => setOtp(text)}
                keyboardType="number-pad"
                maxLength={6}
                variant="underlined"
                textAlign={'center'}
                fontSize={30}
              />
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}>
                Kode OTP Salah.
              </FormControl.ErrorMessage>
            </Stack>
          </FormControl>
        </Box>
      </Center>

      <Center h={250}>
        {counter === 0 ? (
          <Pressable onPress={() => resendOtp(65)}>
            <Text color={'blue.900'}>
              Belum terima OTP? Kirim Ulang{' '}
              {counter === 0 ? 'Sekarang' : `dalam ${counter} detik`}
            </Text>
          </Pressable>
        ) : isLoading ? (
          <HStack space={2} justifyContent="center">
            <Spinner accessibilityLabel="Loading posts" />
            <Heading color="primary.500" fontSize="md">
              Loading
            </Heading>
          </HStack>
        ) : (
          <Text>
            Belum terima OTP? Kirim Ulang{' '}
            {counter === 0 ? 'Sekarang' : `dalam ${counter} detik`}
          </Text>
        )}
      </Center>
    </>
  );
};
