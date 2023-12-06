import React, {useState} from 'react';
import {ScrollView} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  launchCamera,
  launchImageLibrary,
  ImagePickerResponse,
  Asset,
} from 'react-native-image-picker';
import AuthNetwork from '../../Network/lib/auth';
import {Center, FormControl, Text, Pressable, Icon, View} from 'native-base';
import Container from '../../Components/Layout/Container';
import BaseInput from '../../Components/Form/BaseInput';
import PhotoInput from '../../Components/Form/PhotoInput';
import UploadPhotoModal from '../../Components/Modal/UploadPhotoModal';
import LocationPicker from '../../Components/Form/LocationPicker';
import BaseButton from '../../Components/Button/BaseButton';
import useErrorHandler from '../../Hooks/useErrorHandler';
import useAlert from '../../Hooks/useAlert';

type RegisterScreenProps = {
  navigation: any; // If you are using react-navigation, replace any with the correct navigation type
};
type TLocation = {
  latitude: number;
  longitude: number;
};

export const RegisterScreen: React.FC<RegisterScreenProps> = ({navigation}) => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    password_confirmation: '',
    name: '',
    business_phone: '',
    business_address: '',
    business_name: '',
  });
  const [imageCamera, setImageCamera] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [show, setShow] = React.useState(false);
  const [dataCamera, setDataCamera] = useState<DataCamera | undefined>(
    undefined,
  );
  const [location, setLocation] = useState<TLocation | undefined>(undefined);
  const {getFormError, clearFormErrors, setFormErrors, isInvalid} =
    useErrorHandler();
  const alert = useAlert();

  const handleForm = (key: string, data: string): void => {
    setForm(prev => ({
      ...prev,
      [key]: data,
    }));
  };

  interface DataCamera {
    uri?: string;
    fileName?: string;
    fileSize?: number;
    type?: string;
  }

  const onLocationSelect = (loc: TLocation, address: string) => {
    setLocation({
      latitude: loc.latitude,
      longitude: loc.longitude,
    });
    handleForm('business_address', address);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    clearFormErrors();
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('email', form.email);
    formData.append('password', form.password);
    formData.append('password_confirmation', form.password_confirmation);
    formData.append('business_phone', form.business_phone);
    formData.append('business_name', form.business_name);
    formData.append('business_address', form.business_address);
    if (location) {
      formData.append('lat', location?.latitude);
      formData.append('lng', location?.longitude);
    }
    if (dataCamera) {
      formData.append('business_photo', {
        uri: dataCamera?.uri,
        name: dataCamera?.fileName,
        size: dataCamera?.fileSize,
        type: dataCamera?.type,
      });
    }
    AuthNetwork.register(formData)
      .then(() => {
        alert.showAlert('success', 'akun berhasil dibuat');
        navigation.navigate('LoginScreen');
      })
      .catch(err => {
        setFormErrors(err);
        alert.showAlert('error', err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
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

  return (
    <Container>
      <ScrollView>
        <Center my={2}>
          <Text fontSize="md" bold>
            Kelola Usaha Jadi Makin Mudah
          </Text>
          <Text mt={2} mb={4} fontSize="sm">
            Kamu hanya perlu mengisi form registrasi dibawah.
          </Text>
        </Center>
        <Center>
          <BaseInput
            inputKey={'name'}
            isRequired={true}
            label={'Nama'}
            placeholder={'example: budi'}
            type={'text'}
            isInvalid={isInvalid('name')}
            warningMessage={getFormError('name')}
            onChangeText={text => handleForm('name', text)}
          />
          <BaseInput
            inputKey={'email'}
            isRequired={true}
            label={'Email'}
            keyboardType={'email-address'}
            placeholder={'example: budi@ezpos.id'}
            type={'text'}
            isInvalid={isInvalid('email')}
            warningMessage={getFormError('email')}
            onChangeText={text => handleForm('email', text)}
          />
          <BaseInput
            inputKey={'password'}
            isRequired={true}
            label={'Password'}
            placeholder={'Masukkan Password'}
            type={show ? 'text' : 'password'}
            isInvalid={isInvalid('password')}
            warningMessage={getFormError('password')}
            onChangeText={text => handleForm('password', text)}
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
            label={'Ulangi Password'}
            placeholder={'Ulangi Password'}
            type={show ? 'text' : 'password'}
            isInvalid={isInvalid('password_confirmation')}
            warningMessage={getFormError('password_confirmation')}
            onChangeText={text => handleForm('password_confirmation', text)}
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
            isRequired={true}
            label={'No Telepon'}
            placeholder={'example: 628xxxxxxxx'}
            type={'text'}
            keyboardType={'number-pad'}
            isInvalid={isInvalid('business_phone')}
            warningMessage={getFormError('business_phone')}
            onChangeText={text => handleForm('business_phone', text)}
          />
          <BaseInput
            isRequired={true}
            label={'Nama Usaha'}
            placeholder={'example: Kasir mart'}
            type={'text'}
            isInvalid={isInvalid('business_name')}
            warningMessage={getFormError('business_name')}
            onChangeText={text => handleForm('business_name', text)}
          />
          <FormControl mt={3} w="100%">
            <FormControl.Label>Lokasi Usaha (Optional)</FormControl.Label>
            <LocationPicker onLocationSelect={onLocationSelect} />
            <Text>
              Lat {location?.latitude}, Lng {location?.longitude}
            </Text>
          </FormControl>
          <BaseInput
            isRequired={true}
            label={'Alamat Usaha'}
            type={'text'}
            placeholder={'jl. jakarta '}
            isInvalid={isInvalid('business_address')}
            warningMessage={getFormError('business_address')}
            onChangeText={text => handleForm('business_address', text)}
          />
          <FormControl mt={3} w="100%">
            <FormControl.Label>Logo Usaha (Optional)</FormControl.Label>
            <PhotoInput
              imageCamera={imageCamera}
              setImageCamera={setImageCamera}
              setIsOpen={setIsOpen}
            />
            <UploadPhotoModal
              textHeader={'Foto Usaha'}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              openCamera={openCamera}
              openGallery={openGallery}
            />
          </FormControl>
        </Center>
        <Center>
          <View width={'100%'} my={4}>
            <BaseButton
              type={'primary'}
              onPress={handleSubmit}
              isLoading={isLoading}
              label="Submit"
            />
          </View>
        </Center>
      </ScrollView>
    </Container>
  );
};
