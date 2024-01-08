import React from 'react';
import {Modal, Pressable, Text, Divider} from 'native-base';
import i18next from '../../services/i18next';

type LanguageModalProps = {
  visible: boolean;
  onClose: () => void;
};

const LanguageModal: React.FC<LanguageModalProps> = ({visible, onClose}) => {
  const changeLng = (lng: string) => {
    i18next.changeLanguage(lng);
    onClose();
  };

  return (
    <Modal size={'full'} isOpen={visible} onClose={onClose}>
      <Modal.Content maxWidth="300px">
        <Modal.CloseButton />
        <Modal.Body>
          <Pressable onPress={() => changeLng('ina')}>
            <Text bold mt={4}>
              Indonesia
            </Text>
          </Pressable>
          <Divider mt={2} />
          <Pressable onPress={() => changeLng('en')}>
            <Text bold mt={4}>
              English
            </Text>
          </Pressable>
          <Divider mt={2} />
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};

export default LanguageModal;
