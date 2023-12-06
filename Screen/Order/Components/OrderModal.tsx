import React, {useContext, useState} from 'react';
import {
  Modal,
  Pressable,
  View,
  Text,
  Divider,
  Button,
  Center,
} from 'native-base';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {PrimaryColorContext} from '../../../Context';
import useOrders from '../../../Hooks/useOrders';
import DetailItem from './DetailItem';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCloseConfirm: () => void;
  selectedFilter: string;
  confirmModal: boolean;
  updateStatusParent: (newValue: string) => void;
}

const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  selectedFilter,
  confirmModal,
  onCloseConfirm,
  updateStatusParent,
}) => {
  const {fetchOrdersByStatus} = useOrders();
  const primaryColor = useContext(PrimaryColorContext);
  const [filter, setFilter] = useState('Pending');

  return (
    <Center>
      <Modal size={'full'} isOpen={isOpen} onClose={onClose}>
        <Modal.Content mt={'auto'} maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>
            <Text bold fontSize={'2xl'}>
              Etalase
            </Text>
          </Modal.Header>
          <Modal.Body>
            <Pressable
              onPress={() => {
                setFilter('Pending');
              }}>
              <View flexDirection={'row'}>
                <Text flex={11} mb={2}>
                  Pending
                </Text>
                <View flex={1} mb={2}>
                  {filter === 'Pending' ? (
                    <AntDesign
                      name={'checkcircle'}
                      size={20}
                      color={primaryColor?.primaryColor}
                    />
                  ) : null}
                </View>
              </View>
            </Pressable>
            <Divider />
            <Pressable
              mt={2}
              onPress={() => {
                setFilter('Confirm');
              }}>
              <View flexDirection={'row'}>
                <Text flex={11} mb={2}>
                  Confirm
                </Text>
                <View flex={1} mb={2}>
                  {filter === 'Confirm' ? (
                    <AntDesign
                      name={'checkcircle'}
                      size={20}
                      color={primaryColor?.primaryColor}
                    />
                  ) : null}
                </View>
              </View>
            </Pressable>
            <Divider />

            <Button
              mt={4}
              onPress={() => {
                updateStatusParent(filter);
                fetchOrdersByStatus(selectedFilter, 'ONLINE');
                fetchOrdersByStatus(filter, 'ONLINE');
                onClose();
              }}
              borderRadius={34}
              alignItems={'center'}
              justifyContent={'center'}
              bg={primaryColor?.primaryColor}>
              <Text fontSize={'lg'} color="white">
                Tampilkan
              </Text>
            </Button>
          </Modal.Body>
        </Modal.Content>
      </Modal>
      <Modal
        isOpen={confirmModal}
        onClose={() => onCloseConfirm()}
        size={'full'}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Rincian</Modal.Header>
          <Modal.Body>
            <DetailItem onClose={() => onCloseConfirm()} />
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Center>
  );
};

export default OrderModal;
