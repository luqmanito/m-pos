// HomeScreen.tsx

import React, {useState, useCallback, useEffect, useContext} from 'react';
import {
  View,
  Button,
  Text,
  Input,
  Center,
  Modal,
  Divider,
  Box,
  VStack,
  FormControl,
  WarningOutlineIcon,
  useToast,
} from 'native-base';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  useNavigation,
  NavigationProp,
  useFocusEffect,
} from '@react-navigation/native';

import {clearStateProduct} from '../../Redux/Reducers/product';
import {useDispatch, useSelector} from 'react-redux';
import {clearDataCamera} from '../../Redux/Reducers/upload';
// import orderNetwork from '../../Network/lib/order';
import {RootState} from '../../Redux/store';
import RupiahFormatter from '../../Components/Rupiah/Rupiah';
import NavBar from '../../Components/Navbar/Navbar';
import ToastAlert from '../../Components/Toast/Toast';
import {createPayment} from '../../Redux/Reducers/payment';
import cache from '../../Util/cache';
// import {generateInvoiceNumber} from '../../Components/Invoice/Invoice';
import {dates} from '../../Components/Date/Today';
import {useGenerateInvoiceNumber} from '../../Hooks/useInvoiceTemporary';
import {getCurrentDateTime} from '../../Components/Date/Time';
import useUserInfo from '../../Hooks/useUserInfo';
import {PrimaryColorContext} from '../../Context';
export const PaymentScreen: React.FC = () => {
  const paymentMethodCode = useSelector(
    (state: RootState) => state.buttonSlice?.payment_methodId,
  );
  const cartItems = useSelector((state: RootState) => state.cartSlice.items);
  const totalSum = cartItems.reduce((sum, item) => sum + item.subTotal, 0);
  const totalQty = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const filteredItems = cartItems.filter(item => item.quantity > 0);
  const navigation = useNavigation<NavigationProp<any>>();
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);
  const [nominal, setNominal] = useState<number>(0);
  // const [temporaryInvoice, setTemporaryInvoice] = useState('');
  const [buttonValue, setButtonValue] = useState(50000);
  const [buttonValue2, setButtonValue2] = useState(100000);
  const [exchange, setExchange] = useState<number>(0);
  const [falseInput, setFalseInput] = useState(true);

  const dispatch = useDispatch();
  const toast = useToast();
  useFocusEffect(
    useCallback(() => {
      dispatch(clearStateProduct());
      dispatch(clearDataCamera());
    }, [dispatch]),
  );
  const {userData} = useUserInfo();
  const table_number = useSelector(
    (state: RootState) => state.buttonSlice?.table_number,
  );
  const globalState = useSelector((state: RootState) => state?.buttonSlice);

  const handlePriceChange = (value: string) => {
    const numericValue = value.replace(/[^\d]/g, '');
    setNominal(Number(numericValue));
  };
  const primaryColor = useContext(PrimaryColorContext);
  const invoiceNumber = useGenerateInvoiceNumber();

  useEffect(() => {
    if (paymentMethodCode === 2) {
      setFalseInput(false);
    } else {
      if (nominal) {
        if (nominal >= totalSum) {
          setFalseInput(false);
          setExchange(nominal - totalSum);
        } else {
          setFalseInput(true);
          setExchange(0);
        }
      }
    }
    if (totalSum > buttonValue) {
      const nextButtonValue = Math.ceil(totalSum / 50000) * 50000;
      setButtonValue(nextButtonValue);
      setButtonValue2(nextButtonValue + 50000);
    }
  }, [paymentMethodCode, nominal, buttonValue, totalSum]);

  const submitPayment = async (): Promise<void> => {
    const paymentData = {
      products: filteredItems.map(item => {
        return {
          id: item?.productId,
          quantity: item?.quantity,
          note: item?.note,
        };
      }),
      table_no: table_number,
      payment_method: paymentMethodCode,
      total_paid: nominal,
      ref: 'OFFLINE',
      invoiceNumber,
      date: getCurrentDateTime(),
      total_price: totalSum,
      cashierName: userData?.name,
      name: globalState?.customerName,
      phone: globalState?.customerPhone,
      email: globalState?.customerEmail,
    };
    try {
      let dataSubmissions = await cache.get('paymentSubmissions');
      if (dataSubmissions) {
        dataSubmissions.push(paymentData);
        await cache.store('paymentSubmissions', dataSubmissions);
        ToastAlert(toast, 'sukses', 'Berhasil Bayar');
        navigation.navigate('SuccessfulPaymentScreen');
        dispatch(
          createPayment({
            // products: filteredItems,
            totalPrice: totalSum,
            totalPayment: nominal,
            exchangePayment: exchange,
            invoiceNumber: invoiceNumber,
            datePayment: dates,
            cashierName: userData?.name,
          }),
        );
      } else {
        dataSubmissions = [];
        dataSubmissions.push(paymentData);
        await cache.store('paymentSubmissions', dataSubmissions);
        ToastAlert(toast, 'sukses', 'Berhasil Bayar');
        navigation.navigate('SuccessfulPaymentScreen');
        dispatch(
          createPayment({
            // products: filteredItems,
            totalPrice: totalSum,
            totalPayment: nominal,
            exchangePayment: exchange,
            invoiceNumber: invoiceNumber,
            datePayment: dates,
            cashierName: userData?.name,
          }),
        );
      }

      // const response = await orderNetwork.pay({
      //   products: filteredItems.map(item => {
      //     return {
      //       id: item?.productId,
      //       quantity: item?.quantity,
      //       note: item?.note,
      //     };
      //   }),
      //   table_no: table_number,
      //   payment_method: paymentMethodCode,
      //   total_paid: nominal,
      //   ref: 'ONLINE',
      // });

      // if (response) {
      //   dispatch(
      //     createPayment({
      //       products: response?.data?.products,
      //       totalPrice: totalSum,
      //       totalPayment: nominal,
      //       exchangePayment: exchange,
      //       invoiceNumber: response?.data?.order_code,
      //       datePayment: response?.data?.created_at,
      //       cashierName: 'admin',
      //     }),
      //   );
      //   ToastAlert(toast, 'sukses', 'Berhasil Bayar');
      //   navigation.navigate('SuccessfulPaymentScreen');
      // }
    } catch (error: any) {
      ToastAlert(toast, 'error', error?.response?.data?.message);
      // console.error('Error payment:', error);
      throw error;
    }
  };

  return (
    <>
      <NavBar msg="Pembayaran" />
      <Box flex={1} mx={4} my={4}>
        <Box
          rounded="lg"
          overflow="hidden"
          borderColor="coolGray.200"
          borderWidth="1"
          _dark={{
            borderColor: 'coolGray.600',
            backgroundColor: 'gray.700',
          }}
          _web={{
            shadow: 2,
            borderWidth: 0,
          }}
          _light={{
            backgroundColor: 'gray.50',
          }}>
          <VStack flexDirection={'row'} p={2}>
            <VStack ml={2} flex={6}>
              <Text fontSize={'md'}>Total Tagihan</Text>
              <Text bold fontSize={'lg'}>
                {RupiahFormatter(totalSum)}
              </Text>
            </VStack>
            <VStack
              flex={6}
              mr={2}
              alignItems="flex-end"
              justifyContent={'center'}>
              <Button
                bg={primaryColor?.secondaryColor}
                onPress={() => setIsOpen(true)}
                borderRadius={20}>
                <Text bold fontSize={'md'} color={primaryColor?.primaryColor}>
                  Lihat Detail
                </Text>
              </Button>
            </VStack>
          </VStack>
        </Box>
        {paymentMethodCode === 1 ? (
          <>
            <Text my={4}>Nominal Pembayaran</Text>
            <FormControl
              isInvalid={falseInput === false || nominal === 0 ? false : true}>
              <Input
                bg={'white'}
                borderRadius={10}
                value={nominal !== undefined ? RupiahFormatter(nominal) : ''}
                onChangeText={handlePriceChange}
                keyboardType={'numeric'}
                placeholder="Masukkan Harga"
              />
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}>
                Nominal pembayaran kurang dari total tagihan.
              </FormControl.ErrorMessage>
            </FormControl>
            <View flexDirection={'row'}>
              <Button
                mr={4}
                w={'30%'}
                bg={'white'}
                borderRadius={20}
                onPress={() => setNominal(totalSum)}
                mt={4}>
                <Text color={'gray.500'}>Uang Pas</Text>
              </Button>

              <Button
                w={'30%'}
                bg={'white'}
                borderRadius={20}
                onPress={() => setNominal(buttonValue)}
                mt={4}>
                <Text color={'gray.500'}>{RupiahFormatter(buttonValue)}</Text>
              </Button>

              <Button
                isDisabled={(buttonValue / 50000) % 2 === 0 ? true : false}
                w={'30%'}
                mx={4}
                bg={'white'}
                borderRadius={20}
                onPress={() => setNominal(buttonValue2)}
                mt={4}>
                <Text color={'gray.500'}>{RupiahFormatter(buttonValue2)}</Text>
              </Button>
            </View>
          </>
        ) : null}
      </Box>

      <View
        borderTopWidth={1}
        borderTopColor={'gray.200'}
        bg={'#f4f5fa'}
        bottom={4}>
        <View p={2} mx={4} flexDirection={'row'}>
          <Text flex={6} bold>
            Kembalian
          </Text>
          <View flex={6} alignItems={'flex-end'}>
            <Text bold>{RupiahFormatter(exchange)}</Text>
          </View>
        </View>
      </View>

      <View bg={'#f4f5fa'} bottom={18} mx={4}>
        <Button
          isDisabled={falseInput === false ? false : true}
          onPress={() => {
            paymentMethodCode === 1 ? submitPayment() : setIsConfirm(true);
          }}
          borderRadius={34}
          alignItems={'center'}
          justifyContent={'center'}
          bg={primaryColor?.primaryColor}>
          <Text fontSize={'lg'} color="white">
            {paymentMethodCode === 1 ? 'Terima Pembayaran' : 'Sudah Bayar'}
          </Text>
        </Button>
      </View>

      <Center>
        <Modal
          size={'full'}
          isOpen={isConfirm}
          onClose={() => setIsConfirm(false)}>
          <Modal.Content mb={0} mt={'auto'} maxWidth="400px">
            <Modal.CloseButton />
            <Modal.Header>{'Konfirmasi Pembayaran ?'}</Modal.Header>
            <Modal.Body>
              <Text>
                Pesanan akan dianggap sudah dibayar dan dicatat di daftar
                transaksi.
              </Text>
              <Button
                mt={4}
                bg={primaryColor?.primaryColor}
                onPress={() => {
                  submitPayment();
                }}
                leftIcon={<FontAwesome name="check" size={15} color="white" />}>
                <Text bold color={primaryColor?.secondaryColor}>
                  Konfirmasi Pembayaran
                </Text>
              </Button>
              <Button
                mt={4}
                bg={primaryColor?.secondaryColor}
                onPress={() => setIsConfirm(false)}
                leftIcon={
                  <AntDesign
                    name="back"
                    size={15}
                    color={primaryColor?.primaryColor}
                  />
                }>
                <Text bold color={primaryColor?.primaryColor}>
                  Kembali
                </Text>
              </Button>
            </Modal.Body>
          </Modal.Content>
        </Modal>
      </Center>

      <Center>
        <Modal size={'full'} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <Modal.Content mb={0} mt={'auto'} maxWidth="400px">
            <Modal.CloseButton />
            <Modal.Header>{'Detail Tagihan'}</Modal.Header>
            <Modal.Body>
              {filteredItems.map(item => {
                return (
                  <React.Fragment key={item.productId}>
                    <Text>{item?.name}</Text>
                    <View flexDirection={'row'}>
                      <Text flex={6}>{'x' + item?.quantity}</Text>
                      <View
                        flex={6}
                        alignItems={'flex-end'}
                        justifyContent={'center'}>
                        <Text mb={3}>
                          {RupiahFormatter(item?.basePrice * item?.quantity)}
                        </Text>
                      </View>
                    </View>
                  </React.Fragment>
                );
              })}
              <Divider />
              <View mt={2} flexDirection={'row'}>
                <Text flex={6}>{`Subtotal (${totalQty} Produk)`} </Text>
                <View
                  flex={6}
                  alignItems={'flex-end'}
                  justifyContent={'center'}>
                  <Text mb={2}>{RupiahFormatter(totalSum)}</Text>
                </View>
              </View>
              <View flexDirection={'row'}>
                <Text bold flex={6}>
                  Total Tagihan
                </Text>
                <View
                  flex={6}
                  alignItems={'flex-end'}
                  justifyContent={'center'}>
                  <Text bold mb={3}>
                    {RupiahFormatter(totalSum)}
                  </Text>
                </View>
              </View>

              <Button
                mb={4}
                borderRadius={20}
                bg={primaryColor?.primaryColor}
                onPress={() => setIsOpen(false)}
                leftIcon={
                  <AntDesign name="closecircleo" size={15} color="white" />
                }>
                Tutup
              </Button>
            </Modal.Body>
          </Modal.Content>
        </Modal>
      </Center>
    </>
  );
};
