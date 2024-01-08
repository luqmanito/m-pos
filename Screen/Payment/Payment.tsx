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
import orderNetwork from '../../Network/lib/order';
import {RootState} from '../../Redux/store';
import NavBar from '../../Components/Navbar/Navbar';
import {createPayment} from '../../Redux/Reducers/payment';
import {useGenerateInvoiceNumber} from '../../Hooks/useInvoiceTemporary';
import useUserInfo from '../../Hooks/useUserInfo';
import {PrimaryColorContext, useLoading} from '../../Context';
import usePaymentSubmit from '../../Hooks/useSubmitPayment';
import cache from '../../Util/cache';
import RupiahFormatter from '../../Util/Rupiah/Rupiah';
import {dates} from '../../Util/Date/Today';
import {getCurrentDateTime} from '../../Util/Date/Time';
import useAlert from '../../Hooks/useAlert';
import {useTranslation} from 'react-i18next';
const PaymentScreen: React.FC = () => {
  const paymentMethodCode = useSelector(
    (state: RootState) => state.buttonSlice?.payment_methodId,
  );
  const {t} = useTranslation();
  const cartItems = useSelector((state: RootState) => state.cartSlice.items);
  const totalSum = cartItems.reduce((sum, item) => sum + item.subTotal, 0);
  const totalQty = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const {loading} = useLoading();
  const filteredItems = cartItems.filter(item => item.quantity > 0);
  const detailOrderItems = useSelector(
    (state: RootState) => state.orderSlice.order_detail,
  );
  const totalSumCashier = detailOrderItems?.products.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const totalQtyCashier = detailOrderItems?.products.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  const navigation = useNavigation<NavigationProp<any>>();
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);
  const [nominal, setNominal] = useState<number | undefined>(0);
  const [buttonValue, setButtonValue] = useState(50000);
  const [buttonValue2, setButtonValue2] = useState(100000);
  const [exchange, setExchange] = useState<number>(0);
  const [falseInput, setFalseInput] = useState(true);

  const dispatch = useDispatch();
  useFocusEffect(
    useCallback(() => {
      dispatch(clearStateProduct());
      dispatch(clearDataCamera());
    }, [dispatch]),
  );
  const {userData} = useUserInfo();
  const {submitCashierPayment} = usePaymentSubmit();
  const table_number = useSelector(
    (state: RootState) => state.buttonSlice?.table_number,
  );
  const globalState = useSelector((state: RootState) => state?.buttonSlice);
  const alert = useAlert();
  const handlePriceChange = (value: string) => {
    const numericValue = value.replace(/[^\d]/g, '');
    setNominal(Number(numericValue));
  };
  const primaryColor = useContext(PrimaryColorContext);
  const invoiceNumber = useGenerateInvoiceNumber();
  const routes = navigation.getState()?.routes;
  const prevRoute = routes[routes.length - 3];
  const isKitchenScreen =
    prevRoute.name === 'KitchenScreen' || prevRoute.name === 'TellerScreen';

  useEffect(() => {
    if (paymentMethodCode === 2) {
      setFalseInput(false);
    } else {
      if (nominal && !isKitchenScreen) {
        if (nominal >= totalSum) {
          setFalseInput(false);
          setExchange(nominal - totalSum);
        } else {
          setFalseInput(true);
          setExchange(0);
        }
      }
      if (nominal && isKitchenScreen && totalSumCashier) {
        if (nominal >= totalSumCashier) {
          setFalseInput(false);
          setExchange(nominal - totalSumCashier);
        } else {
          setFalseInput(true);
          setExchange(0);
        }
      }
    }
    if (isKitchenScreen && totalSumCashier) {
      if (totalSumCashier > buttonValue) {
        const nextButtonValue = Math.ceil(totalSumCashier / 50000) * 50000;
        setButtonValue(nextButtonValue);
        setButtonValue2(nextButtonValue + 50000);
      }
    } else if (!isKitchenScreen) {
      if (totalSum > buttonValue) {
        const nextButtonValue = Math.ceil(totalSum / 50000) * 50000;
        setButtonValue(nextButtonValue);
        setButtonValue2(nextButtonValue + 50000);
      }
    }
  }, [
    paymentMethodCode,
    nominal,
    buttonValue,
    totalSum,
    isKitchenScreen,
    totalSumCashier,
  ]);

  const submitPayment = async (): Promise<void> => {
    try {
      const response = await orderNetwork.pay({
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
        name: globalState?.customerName,
        phone: globalState?.customerPhone,
        email: globalState?.customerEmail,
      });
      if (response) {
        dispatch(
          createPayment({
            products: response?.data?.products,
            totalPrice: totalSum,
            totalPayment: nominal,
            exchangePayment: exchange,
            invoiceNumber: response?.data?.order_code,
            datePayment: response?.data?.created_at,
            cashierName: userData?.name,
          }),
        );
        alert.showAlert('success', t('pay-done'));
        navigation.navigate('SuccessfulPaymentScreen');
      }
    } catch (error: any) {
      submitFailedPayment();
      throw error;
    }
  };

  const submitFailedPayment = async (): Promise<void> => {
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
      // FOR OFFLINE MODE
      let dataSubmissions = await cache.get('paymentSubmissions');
      if (dataSubmissions) {
        dataSubmissions.push(paymentData);
        await cache.store('paymentSubmissions', dataSubmissions);
        alert.showAlert('success', t('offline-pay'));
        navigation.navigate('SuccessfulPaymentScreen');
        dispatch(
          createPayment({
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
        alert.showAlert('success', t('offline-pay'));
        navigation.navigate('SuccessfulPaymentScreen');
        dispatch(
          createPayment({
            totalPrice: totalSum,
            totalPayment: nominal,
            exchangePayment: exchange,
            invoiceNumber: invoiceNumber,
            datePayment: dates,
            cashierName: userData?.name,
          }),
        );
      }
    } catch (error: any) {
      alert.showAlert('error', error?.response?.data?.message);
      throw error;
    }
  };

  return (
    <>
      <NavBar msg={t('payment')} />
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
              <Text fontSize={'md'}>{t('total-bill')}</Text>
              <Text bold fontSize={'lg'}>
                {RupiahFormatter(totalSum || detailOrderItems?.total)}
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
                  {t('see-detail')}
                </Text>
              </Button>
            </VStack>
          </VStack>
        </Box>
        {paymentMethodCode === 1 ? (
          <>
            <Text my={4}>{t('nominal')}</Text>
            <FormControl
              isInvalid={falseInput === false || nominal === 0 ? false : true}>
              <Input
                bg={'white'}
                borderRadius={10}
                value={nominal !== undefined ? RupiahFormatter(nominal) : ''}
                onChangeText={handlePriceChange}
                keyboardType={'numeric'}
                placeholder={t('input-price')}
              />
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}>
                {t('pay-insufficent')}
              </FormControl.ErrorMessage>
            </FormControl>
            <View flexDirection={'row'}>
              <Button
                mr={4}
                w={'30%'}
                bg={'white'}
                borderRadius={20}
                onPress={() =>
                  setNominal(
                    isKitchenScreen ? detailOrderItems?.total : totalSum,
                  )
                }
                mt={4}>
                <Text color={'gray.500'}>{t('exact-money')}</Text>
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
            {t('exchange')}
          </Text>
          <View flex={6} alignItems={'flex-end'}>
            <Text bold>{RupiahFormatter(exchange)}</Text>
          </View>
        </View>
      </View>

      <View bg={'#f4f5fa'} bottom={18} mx={4}>
        <Button
          isLoading={loading}
          isLoadingText={'loading...'}
          isDisabled={falseInput === false ? false : true}
          onPress={() => {
            paymentMethodCode === 1 && !isKitchenScreen
              ? submitPayment()
              : paymentMethodCode === 1 && isKitchenScreen
              ? submitCashierPayment(nominal)
              : setIsConfirm(true);
          }}
          borderRadius={34}
          alignItems={'center'}
          justifyContent={'center'}
          bg={primaryColor?.primaryColor}>
          <Text fontSize={'lg'} color="white">
            {paymentMethodCode === 1 ? t('accept-payment') : t('payment-done')}
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
            <Modal.Header>{t('pay-check')}</Modal.Header>
            <Modal.Body>
              <Text>{t('pay-note')}</Text>
              <Button
                mt={4}
                bg={primaryColor?.primaryColor}
                onPress={() => {
                  submitPayment();
                }}
                leftIcon={<FontAwesome name="check" size={15} color="white" />}>
                <Text bold color={primaryColor?.secondaryColor}>
                  {t('pay-confirm')}
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
                  {t('exchange')}
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
            <Modal.Header>{t('pay-detail')}</Modal.Header>
            <Modal.Body>
              {isKitchenScreen
                ? detailOrderItems?.products.map(item => {
                    return (
                      <React.Fragment key={item.product_id}>
                        <Text>{item?.name}</Text>
                        <View flexDirection={'row'}>
                          <Text flex={6}>{'x' + item?.quantity}</Text>
                          <View
                            flex={6}
                            alignItems={'flex-end'}
                            justifyContent={'center'}>
                            <Text mb={3}>
                              {RupiahFormatter(item?.price * item?.quantity)}
                            </Text>
                          </View>
                        </View>
                      </React.Fragment>
                    );
                  })
                : filteredItems.map(item => {
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
                              {RupiahFormatter(
                                item?.basePrice * item?.quantity,
                              )}
                            </Text>
                          </View>
                        </View>
                      </React.Fragment>
                    );
                  })}
              <Divider />
              <View mt={2} flexDirection={'row'}>
                <Text flex={6}>
                  {`Subtotal (${
                    isKitchenScreen ? totalQtyCashier : totalQty
                  } ${t('product')})`}{' '}
                </Text>
                <View
                  flex={6}
                  alignItems={'flex-end'}
                  justifyContent={'center'}>
                  <Text mb={2}>
                    {RupiahFormatter(
                      isKitchenScreen ? totalSumCashier : totalSum,
                    )}
                  </Text>
                </View>
              </View>
              <View flexDirection={'row'}>
                <Text bold flex={6}>
                  {t('total-bill')}
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
                {t('close')}
              </Button>
            </Modal.Body>
          </Modal.Content>
        </Modal>
      </Center>
    </>
  );
};
export default PaymentScreen;
