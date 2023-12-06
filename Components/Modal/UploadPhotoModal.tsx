import React from 'react';
import {Modal, Button, Center} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface UploadPhotoModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  openCamera: () => void;
  openGallery: () => void;
  textHeader: string;
}

const UploadPhotoModal: React.FC<UploadPhotoModalProps> = ({
  isOpen,
  setIsOpen,
  openCamera,
  openGallery,
  textHeader,
}) => {
  return (
    <Center>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>{textHeader}</Modal.Header>
          <Modal.Body>
            <Button
              bg={'#29B9DC'}
              leftIcon={
                <MaterialCommunityIcons
                  name="camera-outline"
                  size={20}
                  color="white"
                />
              }
              onPress={openCamera}>
              Ambil Foto Kamera
            </Button>
            <Button
              bg={'#29B9DC'}
              leftIcon={<Fontisto name="photograph" size={20} color="white" />}
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
  );
};

export default UploadPhotoModal;
