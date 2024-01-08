import React from 'react';
import {Text, Button, Center, Modal} from 'native-base';
import {useLoading} from '../../../Context';
import useDeleteProduct from '../../../Hooks/useDeleteProduct';
import {useTranslation} from 'react-i18next';

interface EmployeeModalProps {
  isOpen: boolean;
  resetphotos: () => void;
  handleDeletedPhoto: () => void;
  id: number | null;
  updateParentState: (newValue: boolean) => void;
  isDeleteProduct: boolean;
  onClose: () => void;
}

const DeletePhotoModal: React.FC<EmployeeModalProps> = ({
  updateParentState,
  isOpen,
  handleDeletedPhoto,
  resetphotos,
  isDeleteProduct,
  id,
  onClose,
}) => {
  const {t} = useTranslation();
  const {loading} = useLoading();
  const {handleSubmitDelete} = useDeleteProduct(id);
  function deleteMedia(): void {
    onClose();
    resetphotos();
    handleDeletedPhoto();
  }
  return (
    <>
      <Center>
        <Modal
          size={'lg'}
          isOpen={isOpen}
          onClose={() => {
            updateParentState(false);
            onClose();
          }}>
          <Modal.Content mb={0} maxWidth="400px">
            <Modal.CloseButton />
            <Modal.Header>
              {isDeleteProduct ? t('del-product') : t('del-photo')}
            </Modal.Header>
            <Text mx={4} mt={4}>
              {isDeleteProduct ? t('delete-product') : t('delete-photo')}
            </Text>
            <Modal.Body flexDirection={'row'}>
              <Button
                flex={1}
                mx={4}
                isLoading={loading}
                isLoadingText="Loading.."
                disabled={loading}
                bg={'#ef4536'}
                onPress={() => {
                  isDeleteProduct ? handleSubmitDelete() : deleteMedia();
                }}>
                <Text color={'#fdecec'}>{t('yes')}</Text>
              </Button>
              <Button
                flex={1}
                bg={'#fdecec'}
                isLoading={loading}
                disabled={loading}
                isLoadingText="Loading.."
                onPress={() => {
                  updateParentState(false);
                  onClose();
                }}>
                <Text color={'#ef4536'}>{t('no')}</Text>
              </Button>
            </Modal.Body>
          </Modal.Content>
        </Modal>
      </Center>
    </>
  );
};

export default DeletePhotoModal;
