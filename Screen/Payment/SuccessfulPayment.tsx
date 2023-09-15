import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import React from 'react';
import {View, Button, Text, Center, Divider, ScrollView} from 'native-base';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../Redux/store';
import RupiahFormatter from '../../Components/Rupiah/Rupiah';
// import DateFormatter from '../../Components/Date/Date';
import {clearCartPayment} from '../../Redux/Reducers/payment';
import {clearCart} from '../../Redux/Reducers/cart';
import {clearStateButton} from '../../Redux/Reducers/button';
import PrintReceipt from '../Printer/Components/PrintReceipt';

type PaymentProps = {
  navigation: any; // If you are using react-navigation, replace any with the correct navigation type
};

export const SuccessfulPaymentScreen: React.FC<PaymentProps> = ({
  navigation,
}) => {
  const dispatch = useDispatch();
  const paymentReceipt = useSelector(
    (state: RootState) => state.paymentSlice.items[0],
  );

  return (
    <>
      <ScrollView>
        <View mt={10} justifyContent={'center'} alignItems={'center'}>
          <AntDesign name="checkcircleo" size={105} color="#2cc051" />
        </View>
        <Center>
          <Text mt={4} fontSize={30}>
            Pembayaran Berhasil
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
                Nominal Pembayaran
              </Text>
              <Text bold mx={4} fontSize={'xl'}>
                {RupiahFormatter(paymentReceipt?.totalPayment)}
              </Text>
              <Text mx={4} mt={2} fontSize={'xl'} color={'#9191a7'}>
                Kembalian
              </Text>
              <Text bold mx={4} fontSize={'xl'}>
                {RupiahFormatter(paymentReceipt.exchangePayment)}
              </Text>
            </>
          ) : null}

          <Text mx={4} mt={2} fontSize={'xl'} color={'#9191a7'}>
            Nomor Pesanan
          </Text>
          <Text bold mx={4} fontSize={'xl'}>
            {paymentReceipt?.invoiceNumber}
          </Text>
          <Text mx={4} mt={2} fontSize={'xl'} color={'#9191a7'}>
            Tanggal Pembayaran
          </Text>
          <Text bold mx={4} fontSize={'xl'}>
            {paymentReceipt?.datePayment}
          </Text>
          <Text mx={4} mt={2} fontSize={'xl'} color={'#9191a7'}>
            Nama Kasir
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
                color="#0c50ef"
              />
              Download Struk
            </Text>
            <Text textAlign={'center'} flex={1} fontSize={'lg'}>
              <MaterialCommunityIcons
                name="share-variant"
                size={20}
                color="#0c50ef"
              />
              Bagikan Struk
            </Text>
          </View>
        </View>

        <PrintReceipt />
        <Button
          onPress={() => {
            dispatch(clearCartPayment());
            dispatch(clearCart());
            dispatch(clearStateButton());
            navigation.navigate('Dashboard', {screen: 'Cashier'});
          }}
          borderRadius={18}
          mx={4}
          my={4}
          bg={'#e3e9ff'}>
          <Text fontSize={'md'} color={'#0c50ef'}>
            Tutup
          </Text>
        </Button>
      </ScrollView>
    </>
  );
};
