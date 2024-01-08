import React from 'react';
import {Text, Button, Center, Modal} from 'native-base';
import {useLoading} from '../../../Context';
import useEmployee from '../../../Hooks/useEmployee';
import {useTranslation} from 'react-i18next';

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  id: number | null;
}

const DeleteEmployeeModal: React.FC<EmployeeModalProps> = ({
  id,
  isOpen,
  onClose,
}) => {
  const {loading} = useLoading();
  const {deleteEmployee} = useEmployee();
  const {t} = useTranslation();
  return (
    <>
      <Center>
        <Modal size={'lg'} isOpen={isOpen} onClose={onClose}>
          <Modal.Content maxWidth="400px">
            <Modal.CloseButton />
            <Text mx={4} mt={4}>
              {t('msg-employee')}
            </Text>
            <Modal.Body flexDirection={'row'}>
              <Button
                flex={1}
                mx={4}
                isLoading={loading}
                bg={'#ef4536'}
                onPress={() => {
                  deleteEmployee(id);
                }}>
                <Text color={'#fdecec'}>{t('yes')}</Text>
              </Button>
              <Button
                flex={1}
                bg={'#fdecec'}
                isLoading={loading}
                onPress={onClose}>
                <Text color={'#ef4536'}>{t('no')}</Text>
              </Button>
            </Modal.Body>
          </Modal.Content>
        </Modal>
      </Center>
    </>
  );
};

export default DeleteEmployeeModal;
