import React, {useState, useEffect, useContext} from 'react';
import {ScrollView} from 'react-native';
import store from '../../Public/Assets/online-store.png';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  launchCamera,
  launchImageLibrary,
  ImagePickerResponse,
  Asset,
} from 'react-native-image-picker';
import Geolocation from 'react-native-geolocation-service';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AuthNetwork from '../../Network/lib/auth';
import {
  Center,
  Image,
  Box,
  FormControl,
  Input,
  useToast,
  Button,
  Text,
  Pressable,
  Stack,
  WarningOutlineIcon,
  Icon,
  View,
  HStack,
  VStack,
  Flex,
  Modal,
} from 'native-base';
import ToastAlert from '../../Components/Toast/Toast';
// import useScreenOrientation from '../../Hooks/useScreenOrientation';
import {StyleSheet} from 'react-native';
import {PrimaryColorContext} from '../../Context';

type RegisterScreenProps = {
  navigation: any; // If you are using react-navigation, replace any with the correct navigation type
};

export const RegisterScreen: React.FC<RegisterScreenProps> = ({navigation}) => {
  // const orientation = useScreenOrientation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [strongPassword, setStrongPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenMap, setIsOpenMap] = useState(false);
  const [show, setShow] = React.useState(false);
  const [imageCamera, setImageCamera] = useState<string | undefined>(undefined);
  const [dataCamera, setDataCamera] = useState<DataCamera | undefined>(
    undefined,
  );
  const primaryColor = useContext(PrimaryColorContext);
  const [currentLoc, setCurrentLoc] = useState({
    latitude: null,
    longitude: null,
  });

  const handleChange = (position: string, value: number) => {
    setCurrentLoc(prevLoc => ({
      ...prevLoc,
      [position]: value,
    }));
  };

  interface DataCamera {
    uri?: string;
    fileName?: string;
    fileSize?: number;
    type?: string;
  }
  const toast = useToast();

  function isStrongPassword(input: string): void {
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (passwordPattern.test(input) === true) {
      setStrongPassword(true);
    } else {
      setStrongPassword(false);
    }
  }

  async function getCurrentLocation() {
    const result = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    if (result === RESULTS.GRANTED) {
      Geolocation.getCurrentPosition(
        position => {
          handleChange('latitude', position?.coords?.latitude);
          handleChange('longitude', position?.coords?.longitude);
        },
        error => {
          console.log(error.code, error.message);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    } else {
      console.log('unauthorized');
    }
  }

  useEffect(() => {
    if (password.length > 0) {
      isStrongPassword(password);
    } else {
      setStrongPassword(true);
    }
  }, [password]);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('password_confirmation', passwordConfirmation);
      formData.append('business_phone', phoneNumber);
      formData.append('business_name', businessName);
      formData.append('business_address', businessAddress);
      formData.append('lat', currentLoc?.latitude);
      formData.append('lng', currentLoc?.longitude);
      if (dataCamera) {
        formData.append('business_photo', {
          uri: dataCamera?.uri,
          name: dataCamera?.fileName,
          size: dataCamera?.fileSize,
          type: dataCamera?.type,
        });
      }
      const response = await AuthNetwork.register({
        data: formData,
      });
      if (response) {
        setIsLoading(false);
        ToastAlert(toast, 'sukses', 'Akun Berhasil dibuat');
        navigation.navigate('LoginScreen');
      }
    } catch (error: any) {
      ToastAlert(toast, 'error', error?.response?.data?.message);
      console.log(error);
      setIsLoading(false);
    }
  };

  const openCamera = () => {
    setIsOpen(false);
    launchCamera({mediaType: 'photo'}, (response: ImagePickerResponse) => {
      if (!response.didCancel && !response.errorMessage) {
        const asset: Asset | undefined = response.assets && response.assets[0];
        if (asset) {
          setDataCamera({
            uri: asset.uri,
            fileName: asset.fileName,
            fileSize: asset.fileSize,
            type: asset.type,
          });
          setImageCamera(asset.uri);
        }
      }
    });
  };
  const openGallery = () => {
    setIsOpen(false);
    launchImageLibrary(
      {mediaType: 'photo'},
      (response: ImagePickerResponse) => {
        if (!response.didCancel && !response.errorMessage) {
          if (response?.assets) {
            setDataCamera(response?.assets[0]);
            setImageCamera(response?.assets[0]?.uri);
          }
        }
      },
    );
  };

  const initialRegion = {
    latitude: currentLoc?.latitude || -6.9175,
    longitude: currentLoc?.longitude || 107.6191,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  };

  const styles = StyleSheet.create({
    container: {
      // ...StyleSheet.absoluteFillObject,
      // flex: 1,
      height: 400,
      // width: 400,
      marginBottom: 20,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
  });

  return (
    <>
      {/* <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={initialRegion}
        />
      </View> */}
      <ScrollView>
        <Center my={4}>
          <Image
            source={store}
            width={350}
            resizeMode="contain"
            alt="logo-register"
          />
        </Center>
        {/* <Center mt={orientation === 'portrait' ? -60 : null}> */}
        <Center>
          <Text fontSize="md" bold>
            Kelola Usaha Jadi Makin Gampang
          </Text>
          <Text mt={2} mb={4} fontSize="sm">
            Kami hanya perlu mengisi form registrasi dibawah.
          </Text>
        </Center>

        <Center>
          <Box w="100%" mt={4} alignItems="center">
            <FormControl isRequired>
              <Stack mx="4">
                <FormControl.Label>Nama</FormControl.Label>
                <Input
                  onChangeText={text => setName(text)}
                  type="text"
                  placeholder="Contoh: budi"
                />
                <FormControl.ErrorMessage
                  leftIcon={<WarningOutlineIcon size="xs" />}>
                  Silakan Isi Nama Anda.
                </FormControl.ErrorMessage>
              </Stack>
            </FormControl>

            <FormControl mt={4} isRequired>
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
          <Box w="100%" marginTop={4} alignItems="center">
            <FormControl
              isInvalid={strongPassword === false ? true : false}
              isRequired>
              <Stack mx="4">
                <FormControl.Label>Password</FormControl.Label>
                <Input
                  onChangeText={text => setPassword(text)}
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
                {strongPassword === false ? (
                  <FormControl.ErrorMessage
                    leftIcon={<WarningOutlineIcon size="xs" />}>
                    Min 8 karakter dengan kombinasi min 1 huruf kapital dan
                    angka.
                  </FormControl.ErrorMessage>
                ) : null}
              </Stack>
            </FormControl>

            <FormControl mt={4} isRequired>
              <Stack mx="4">
                <FormControl.Label>Konfirmasi Password</FormControl.Label>
                <Input
                  onChangeText={text => setPasswordConfirmation(text)}
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
                <FormControl.ErrorMessage
                  leftIcon={<WarningOutlineIcon size="xs" />}>
                  Atleast 6 characters are required.
                </FormControl.ErrorMessage>
              </Stack>
            </FormControl>

            <FormControl mt={4} isRequired>
              <Stack mx="4">
                <FormControl.Label>No Telepon</FormControl.Label>
                <Input
                  onChangeText={text => setPhoneNumber(text)}
                  keyboardType={'number-pad'}
                  placeholder="Contoh: 0812345678"
                />
                <FormControl.ErrorMessage
                  leftIcon={<WarningOutlineIcon size="xs" />}>
                  Silakan Isi Email Anda.
                </FormControl.ErrorMessage>
              </Stack>
            </FormControl>

            <FormControl mt={4} isRequired>
              <Stack mx="4">
                <FormControl.Label>Nama Usaha</FormControl.Label>
                <Input
                  onChangeText={text => setBusinessName(text)}
                  type="text"
                  placeholder="Contoh: Kasir Mart"
                />
                <FormControl.ErrorMessage
                  leftIcon={<WarningOutlineIcon size="xs" />}>
                  Silakan Isi Email Anda.
                </FormControl.ErrorMessage>
              </Stack>
            </FormControl>

            <FormControl mt={4} isRequired>
              <Stack mx="4">
                <FormControl.Label>Alamat Usaha</FormControl.Label>
                <Input
                  onChangeText={text => setBusinessAddress(text)}
                  type="text"
                  placeholder="Contoh: jl. pancarakan muncang 5"
                />
                <FormControl.ErrorMessage
                  leftIcon={<WarningOutlineIcon size="xs" />}>
                  Silakan Isi Email Anda.
                </FormControl.ErrorMessage>
              </Stack>
            </FormControl>

            <FormControl mt={4} isRequired>
              <Stack mx="4">
                <FormControl.Label>Lokasi Usaha</FormControl.Label>
                {currentLoc?.latitude === null ? (
                  <Button
                    onPress={() => {
                      setIsOpenMap(true);
                    }}
                    bg={primaryColor?.primaryColor}
                    borderRadius={10}>
                    Pilih Lokasi
                  </Button>
                ) : (
                  <View flexDirection={'row'}>
                    <View flex={4}>
                      <Input
                        isReadOnly={true}
                        value={`lat ${currentLoc?.latitude}, lng ${currentLoc?.longitude}`}
                        type="text"
                        placeholder="Contoh: jl. pancarakan muncang 5"
                      />
                    </View>
                    <View justifyContent={'center'} ml={4} flex={8}>
                      <Button
                        w={'30%'}
                        onPress={() => {
                          setIsOpenMap(true);
                        }}
                        bg={primaryColor?.primaryColor}
                        borderRadius={10}>
                        Ganti Lokasi
                      </Button>
                    </View>
                  </View>
                )}
              </Stack>
            </FormControl>

            <FormControl mt={3} w="100%">
              <FormControl.Label mx={4}>
                Foto Usaha (Optional)
              </FormControl.Label>
              <HStack mt={2} space={3}>
                <VStack paddingLeft={4}>
                  <Flex>
                    {imageCamera ? (
                      <View width={120} position={'relative'}>
                        <Image
                          position={'relative'}
                          alignItems="flex-end"
                          source={{uri: imageCamera}}
                          // source={store}
                          width={100}
                          height={120}
                          alt="logo-pemkab"
                          // fallbackSource={noImage}
                        />
                        <View
                          position={'absolute'}
                          top={5}
                          mt={-7}
                          color={'red.100'}
                          right={3}>
                          <MaterialIcons
                            onPress={() => setImageCamera('')}
                            name="cancel"
                            size={27}
                            color="gray"
                          />
                        </View>
                      </View>
                    ) : (
                      <MaterialIcons
                        onPress={() => setIsOpen(true)}
                        name="add-photo-alternate"
                        size={45}
                        color={primaryColor?.primaryColor}
                      />
                    )}
                  </Flex>
                </VStack>
              </HStack>
            </FormControl>
          </Box>
        </Center>
        <Center mx={4}>
          <Button
            borderRadius={34}
            mb={5}
            isDisabled={
              !email ||
              !password ||
              !name ||
              !phoneNumber ||
              !businessName ||
              !businessAddress ||
              !strongPassword
                ? true
                : false
            }
            onPress={handleSubmit}
            isLoading={isLoading ? true : false}
            isLoadingText="Loading"
            w={'100%'}
            marginTop={5}
            bg={primaryColor?.primaryColor}>
            <Text fontSize={'md'} color="white">
              <MaterialIcons name="save" color="white" /> Simpan
            </Text>
          </Button>
        </Center>
      </ScrollView>
      <Center>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <Modal.Content maxWidth="400px">
            <Modal.CloseButton />
            <Modal.Header>{'Upload Foto Usaha'}</Modal.Header>
            <Modal.Body>
              <Button
                bg={primaryColor?.primaryColor}
                leftIcon={
                  <MaterialCommunityIcons
                    name="camera-outline"
                    size={20}
                    color="white"
                  />
                }
                onPress={() => openCamera()}>
                Ambil Foto Kamera
              </Button>
              <Button
                bg={primaryColor?.primaryColor}
                leftIcon={
                  <Fontisto name="photograph" size={20} color="white" />
                }
                onPress={openGallery}
                mt={4}>
                Via Gallery
              </Button>
            </Modal.Body>
            <Modal.Footer>
              <Button.Group space={2}>
                <Button
                  leftIcon={
                    <MaterialIcons name="cancel" size={20} color="white" />
                  }
                  colorScheme="danger"
                  onPress={() => {
                    setIsOpen(false);
                  }}>
                  Batalkan
                </Button>
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </Center>

      <Center>
        <Modal isOpen={isOpenMap} onClose={() => setIsOpenMap(false)}>
          <Modal.Content maxWidth="400px">
            <Modal.CloseButton />
            <Modal.Header>{'Lokasi Usaha'}</Modal.Header>
            <Modal.Body>
              <View style={styles.container}>
                <MapView
                  provider={PROVIDER_GOOGLE}
                  style={styles.map}
                  region={initialRegion}
                />
              </View>
              <Button
                bg={primaryColor?.primaryColor}
                leftIcon={<Ionicons name="location" size={15} color="white" />}
                onPress={() => getCurrentLocation()}>
                Ambil lokasi saat ini
              </Button>
            </Modal.Body>
            <Modal.Footer>
              <Button.Group space={2}>
                <Button
                  leftIcon={
                    <MaterialIcons name="cancel" size={20} color="white" />
                  }
                  colorScheme="danger"
                  onPress={() => {
                    setIsOpenMap(false);
                  }}>
                  Tutup
                </Button>
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </Center>
    </>
  );
};
