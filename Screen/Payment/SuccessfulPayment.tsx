import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import React, {useContext} from 'react';
import {View, Button, Text, Center, Divider, ScrollView} from 'native-base';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../Redux/store';
import {clearCartPayment} from '../../Redux/Reducers/payment';
import {clearCart} from '../../Redux/Reducers/cart';
import {clearStateButton} from '../../Redux/Reducers/button';
import PrintReceipt from '../Printer/Components/PrintReceipt';
import {PrimaryColorContext} from '../../Context';
import RupiahFormatter from '../../Util/Rupiah/Rupiah';
import formatDate from '../../Util/Date/Date';
import {useTranslation} from 'react-i18next';

type PaymentProps = {
  navigation: any;
};

const SuccessfulPaymentScreen: React.FC<PaymentProps> = ({navigation}) => {
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const routes = navigation.getState()?.routes;
  const prevRoute = routes[routes.length - 4];
  const isKitchenScreen = prevRoute?.name === 'TellerScreen';
  const paymentReceipt = useSelector(
    (state: RootState) => state.paymentSlice.items[0],
  );
  const primaryColor = useContext(PrimaryColorContext);
  return (
    <>
      <ScrollView>
        <View mt={10} justifyContent={'center'} alignItems={'center'}>
          <AntDesign name="checkcircleo" size={105} color="#2cc051" />
        </View>
        <Center>
          <Text mt={4} fontSize={30}>
            {t('Succesfull-transaction')}
          </Text>
        </Center>
        <View
          mt={4}
          mx={4}
          borderTopRadius={10}
          borderTopColor={'gray.200'}
          bg={'white'}>
          <View mx={4} my={4} flexDirection={'row'}>
            <Text mx={4} fontSize={'lg'} flex={5} bold>
              {paymentReceipt?.totalPayment ? 'Tunai' : 'non-Tunai'}
            </Text>
            <View
              justifyContent={'center'}
              alignItems={'flex-end'}
              mr={4}
              flex={1}>
              <Entypo name="wallet" size={20} color="#8388ad" />
            </View>
          </View>
        </View>
        <View bg={'white'} mt={2} mx={4} borderBottomRadius={10}>
          <Text mx={4} mt={4} bold fontSize={'4xl'}>
            {RupiahFormatter(paymentReceipt?.totalPrice)}
          </Text>
          {paymentReceipt?.totalPayment ? (
            <>
              <Text mx={4} mt={2} fontSize={'xl'} color={'#9191a7'}>
                {t('nominal')}
              </Text>
              <Text bold mx={4} fontSize={'xl'}>
                {RupiahFormatter(paymentReceipt?.totalPayment)}
              </Text>
              <Text mx={4} mt={2} fontSize={'xl'} color={'#9191a7'}>
                {t('exchange')}
              </Text>
              <Text bold mx={4} fontSize={'xl'}>
                {RupiahFormatter(paymentReceipt.exchangePayment)}
              </Text>
            </>
          ) : null}

          <Text mx={4} mt={2} fontSize={'xl'} color={'#9191a7'}>
            {t('order-no')}
          </Text>
          <Text bold mx={4} fontSize={'xl'}>
            {paymentReceipt?.invoiceNumber}
          </Text>
          <Text mx={4} mt={2} fontSize={'xl'} color={'#9191a7'}>
            {t('payment-date')}
          </Text>
          <Text bold mx={4} fontSize={'xl'}>
            {formatDate(paymentReceipt?.datePayment)}
          </Text>
          <Text mx={4} mt={2} fontSize={'xl'} color={'#9191a7'}>
            {t('cashier-name')}
          </Text>
          <Text mb={4} bold mx={4} fontSize={'xl'}>
            {paymentReceipt?.cashierName}
          </Text>
          <Divider />
          <View mx={4} my={4} flexDirection={'row'}>
            <Text textAlign={'center'} flex={1} fontSize={'lg'}>
              <MaterialCommunityIcons
                name="download"
                size={20}
                color={primaryColor?.primaryColor}
              />
              {t('download')}
            </Text>
            <Text textAlign={'center'} flex={1} fontSize={'lg'}>
              <MaterialCommunityIcons
                name="share-variant"
                size={20}
                color={primaryColor?.primaryColor}
              />
              {t('share')}
            </Text>
          </View>
        </View>

        <PrintReceipt />
        <Button
          onPress={() => {
            dispatch(clearCartPayment());
            dispatch(clearCart());
            dispatch(clearStateButton());
            navigation.navigate(
              isKitchenScreen ? 'TellerScreen' : 'Dashboard',
              {screen: 'Cashier'},
            );
          }}
          borderRadius={18}
          mx={4}
          my={4}
          bg={primaryColor?.secondaryColor}>
          <Text fontSize={'md'} color={primaryColor?.primaryColor}>
            {t('close')}
          </Text>
        </Button>
      </ScrollView>
    </>
  );
};
export default SuccessfulPaymentScreen;
