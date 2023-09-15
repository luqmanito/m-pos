import React, {useState} from 'react';
import {Button, Center, Modal, Text} from 'native-base';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useDispatch} from 'react-redux';
import {
  launchCamera,
  launchImageLibrary,
  ImagePickerResponse,
  Asset,
  ImageLibraryOptions,
} from 'react-native-image-picker';
import {DataCamera, setDataCamera} from '../../Redux/Reducers/upload';

interface UploadCompProps {
  position: string;
  title: string;
  size: string;
}

export const UploadComp = ({position, title, size}: UploadCompProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const option: ImageLibraryOptions = {
    mediaType: 'photo',
    includeBase64: true,
  };
  const openCamera = () => {
    setIsOpen(false);
    launchCamera(option, (response: ImagePickerResponse) => {
      if (!response.didCancel && !response.errorMessage) {
        const asset: Asset | undefined = response.assets && response.assets[0];
        const newDataCamera: DataCamera = {
          uri: asset?.uri,
          fileName: asset?.fileName,
          fileSize: asset?.fileSize,
          type: asset?.type,
          base64: asset?.base64,
        };
        console.log(newDataCamera);

        dispatch(setDataCamera(newDataCamera));
      }
    });
  };
  const openGallery = () => {
    setIsOpen(false);
    launchImageLibrary(option, (response: ImagePickerResponse) => {
      if (!response.didCancel && !response.errorMessage) {
        const asset: Asset | undefined = response.assets && response.assets[0];
        const newDataCamera: DataCamera = {
          uri: asset?.uri,
          fileName: asset?.fileName,
          fileSize: asset?.fileSize,
          type: asset?.type,
          base64: asset?.base64,
        };
        console.log(newDataCamera);
        dispatch(setDataCamera(newDataCamera));
      }
    });
  };

  return (
    <>
      <MaterialIcons
        onPress={() => setIsOpen(true)}
        name="add-photo-alternate"
        size={45}
        color="#0c50ef"
      />
      <Center>
        <Modal size={size} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <Modal.Content mb={0} mt={position ? 'auto' : null} maxWidth="400px">
            <Modal.CloseButton />
            <Modal.Header>{title}</Modal.Header>
            <Modal.Body>
              <Button
                bg={'#0c50ef'}
                leftIcon={<FontAwesome name="camera" size={15} color="white" />}
                onPress={() => openCamera()}>
                Ambil Foto Kamera
              </Button>
              <Button
                bg={'#e3e9ff'}
                leftIcon={
                  <Fontisto name="photograph" size={15} color="#0c50ef" />
                }
                onPress={openGallery}
                mt={4}>
                <Text color={'#0c50ef'}>Via Gallery</Text>
              </Button>
            </Modal.Body>
          </Modal.Content>
        </Modal>
      </Center>
    </>
  );
};
