import {
  Button,
  Center,
  Divider,
  Modal,
  ScrollView,
  Switch,
  Text,
  View,
} from 'native-base';
import React, {useContext, useState} from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import NavBar from '../../Components/Navbar/Navbar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import usePaymentMethod from '../../Hooks/usePaymentMethod';
import useChangePaymentStatus from '../../Hooks/useChangePaymentStatus';
import {PrimaryColorContext} from '../../Context';
import {useTranslation} from 'react-i18next';

const PaymentSettings = () => {
  const {paymentMethod} = usePaymentMethod();
  const submitChange = useChangePaymentStatus().submitChange;
  const [isOpen, setIsOpen] = useState(false);
  const {t} = useTranslation();
  const [selectedPayment, setSelectedPayment] = useState<number | null>(null);
  const [currentStatus, setCurrentStatus] = useState<number | null>(null);
  const primaryColor = useContext(PrimaryColorContext);
  return (
    <>
      <NavBar msg={t('payment-method')} />
      <ScrollView>
        <View bg={'white'} mt={4} mx={4} borderRadius={10}>
          {paymentMethod.map((payment, index) => {
            return (
              <React.Fragment key={payment?.id}>
                <View mt={4} mx={4} flexDirection={'row'}>
                  <View justifyContent={'center'} alignItems={'flex-start'}>
                    <View
                      bg={primaryColor?.secondaryColor}
                      p={2}
                      borderRadius={8}>
                      <Ionicons
                        name={payment?.id === 1 ? 'cash' : 'card'}
                        size={15}
                        color="#8288b3"
                      />
                    </View>
                  </View>
                  <View ml={4} justifyContent={'center'} flex={10}>
                    <Text bold>{payment?.name}</Text>
                  </View>
                  <View
                    justifyContent={'center'}
                    alignItems={'center'}
                    flex={1}>
                    <Switch
                      isChecked={payment?.pivot?.status === 1 ? true : false}
                      onToggle={() => {
                        setSelectedPayment(payment?.pivot?.payment_method_id);
                        setCurrentStatus(payment?.pivot?.status);
                        setIsOpen(true);
                      }}
                      colorScheme={'emerald'}
                      size="lg"
                    />
                  </View>
                </View>
                {}
                <View mx={4} mt={4}>
                  {index !== paymentMethod.length - 1 ? <Divider /> : null}
                </View>
              </React.Fragment>
            );
          })}
        </View>
      </ScrollView>
      <Center>
        <Modal size={'full'} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <Modal.Content mb={0} mt={'auto'} maxWidth="400px">
            <Modal.CloseButton />
            <Modal.Header>{t('method-payment-modal-title')}</Modal.Header>
            <Modal.Body>
              <Text>{t('method-payment-info')}</Text>
              <Button
                mt={4}
                bg={primaryColor?.primaryColor}
                onPress={() => {
                  setIsOpen(false);
                  submitChange({
                    payment_method_id: selectedPayment,
                    status: currentStatus,
                  });
                }}
                leftIcon={<FontAwesome name="check" size={15} color="white" />}>
                <Text bold color={primaryColor?.secondaryColor}>
                  {t('yes')}
                </Text>
              </Button>
              <Button
                mt={4}
                bg={primaryColor?.secondaryColor}
                onPress={() => setIsOpen(false)}
                leftIcon={
                  <MaterialCommunityIcons
                    name="cancel"
                    size={15}
                    color={primaryColor?.primaryColor}
                  />
                }>
                <Text bold color={primaryColor?.primaryColor}>
                  {t('cancel')}
                </Text>
              </Button>
            </Modal.Body>
          </Modal.Content>
        </Modal>
      </Center>
    </>
  );
};

export default PaymentSettings;
