import React, {useContext, useState} from 'react';
import forgotPic from '../../Public/Assets/otp.png';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AuthNetwork from '../../Network/lib/auth';
import {
  Center,
  Image,
  useToast,
  Box,
  FormControl,
  Input,
  Button,
  Text,
  Stack,
  WarningOutlineIcon,
  View,
  ScrollView,
} from 'native-base';
import {useDispatch} from 'react-redux';
import {setEmailUser} from '../../Redux/Reducers/auth';
import ToastAlert from '../../Components/Toast/Toast';
import {PrimaryColorContext} from '../../Context';

type ForgotScreenProps = {
  navigation: any;
};

export const ForgotScreen: React.FC<ForgotScreenProps> = ({navigation}) => {
  const toast = useToast();
  const primaryColor = useContext(PrimaryColorContext);
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await AuthNetwork.forgot({
        email: email,
      });
      if (response) {
        setIsLoading(false);
        dispatch(setEmailUser(email));
        navigation.navigate('OtpScreen');
      }
    } catch (error) {
      console.log(error);
      ToastAlert(toast, 'error', 'Email salah atau belum terdaftar');
      setIsLoading(false);
    }
  };

  return (
    <>
      <ScrollView>
        <Center my={4}>
          <Image
            source={forgotPic}
            size={385}
            resizeMode="contain"
            alt="logo-pemkab"
          />
        </Center>
        <Center flex={1}>
          <Text fontSize="md" bold>
            Masukkan Alamat Email yang Terdaftar
          </Text>
          <Text
            numberOfLines={2}
            textAlign={'center'}
            mx={4}
            mt={2}
            fontSize="sm">
            Kami akan mengirimkan OTP untuk me-reset password ke alamat
            email-mu.
          </Text>

          <Box w="100%" mt={4} alignItems="center">
            <FormControl isRequired>
              <Stack mx="4">
                <FormControl.Label>Alamat Email</FormControl.Label>
                <Input
                  onChangeText={text => setEmail(text)}
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
        </Center>
      </ScrollView>

      <View alignSelf={'center'} position={'absolute'} bottom={18} w={'90%'}>
        <Button
          borderRadius={34}
          isDisabled={!email ? true : false}
          onPress={handleSubmit}
          isLoading={isLoading ? true : false}
          isLoadingText="Loading"
          w={'100%'}
          marginTop={5}
          bg={primaryColor?.primaryColor}>
          <Text fontSize={'md'} color="white">
            <MaterialCommunityIcons name="email-send" color="white" /> Kirim OTP
          </Text>
        </Button>

        <Button
          onPress={() => navigation.navigate('LoginScreen')}
          borderRadius={34}
          isLoadingText="Loading"
          w={'100%'}
          marginTop={5}
          bg={primaryColor?.primaryColor}>
          <Text fontSize={'md'} color="white">
            <MaterialIcons name="cancel" color="white" /> Batal
          </Text>
        </Button>
      </View>
    </>
  );
};
