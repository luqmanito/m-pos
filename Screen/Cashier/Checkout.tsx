// HomeScreen.tsx

import React, {useState, useCallback, useContext} from 'react';
import {
  View,
  Button,
  Text,
  Input,
  Center,
  ScrollView,
  Modal,
  TextArea,
  FormControl,
  Stack,
} from 'native-base';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  useNavigation,
  NavigationProp,
  useFocusEffect,
} from '@react-navigation/native';

import {clearStateProduct} from '../../Redux/Reducers/product';
import {useDispatch, useSelector} from 'react-redux';
import {clearDataCamera} from '../../Redux/Reducers/upload';
import Product from '../../Components/Product/Product';
import {RootState} from '../../Redux/store';
import {clearCart, updateCartItemQuantity} from '../../Redux/Reducers/cart';
import RupiahFormatter from '../../Components/Rupiah/Rupiah';
import NavBar from '../../Components/Navbar/Navbar';
import {
  setCustomerEmail,
  setCustomerName,
  setCustomerPhone,
  setNote,
  setTableNumber,
} from '../../Redux/Reducers/button';
import {screenWidth} from '../../App';
import {PrimaryColorContext, useLoading} from '../../Context';
import usePaymentSubmit from '../../Hooks/useSubmitPayment';
import useUserInfo from '../../Hooks/useUserInfo';

const CheckoutScreen: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const cartItems = useSelector((state: RootState) => state.cartSlice.items);
  const totalSum = cartItems.reduce((sum, item) => sum + item.subTotal, 0);
  const filteredItems = cartItems.filter(item => item.quantity > 0);
  const [noteProduct, setNoteProduct] = useState<string>('');
  const primaryColor = useContext(PrimaryColorContext);
  const {loading} = useLoading();
  const [isOpen, setIsOpen] = useState(false);
  const {onlineModule} = useUserInfo();
  const {singleSubmitPayment} = usePaymentSubmit();
  const table_number = useSelector(
    (state: RootState) => state.buttonSlice?.table_number,
  );
  const customer_name = useSelector(
    (state: RootState) => state.buttonSlice?.customerName,
  );
  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      dispatch(clearStateProduct());
      dispatch(clearDataCamera());
    }, [dispatch]),
  );
  const navigation = useNavigation<NavigationProp<any>>();
  const routes = navigation.getState()?.routes;
  const prevRoute = routes[routes.length - 2];
  const noteState = useSelector((state: RootState) => state.buttonSlice?.note);
  const {updateOrder, confirmOrder} = usePaymentSubmit();
  const idState = useSelector(
    (state: RootState) => state.buttonSlice?.activeId,
  );

  const handleAddNote = (): void => {
    const cartItem = cartItems.find(item => item.productId === idState);

    if (cartItem) {
      dispatch(
        updateCartItemQuantity({
          note: noteProduct,
          productId: cartItem.productId,
          quantity: cartItem.quantity,
          subTotal: cartItem.subTotal,
          name: cartItem.name,
          photos: cartItem.photos,
          basePrice: cartItem.basePrice,
        }),
      );
      dispatch(setNote(false));
    }
  };

  function handleConfirm() {
    updateOrder();
    confirmOrder();
    setIsOpen(false);
  }

  return (
    <>
      <NavBar
        msg={
          prevRoute?.name === 'EditOrderScreen'
            ? 'Ubah Ringkasan Pesanan '
            : 'Ringkasan Pesanan'
        }
      />
      <ScrollView mb={8}>
        <FormControl>
          <Stack mx={4} mt={4}>
            <FormControl.Label>
              Nomor Meja <Text fontWeight={'light'}>{'(opsional)'}</Text>
            </FormControl.Label>
            <Input
              bg={'#f4f5fa'}
              value={table_number}
              borderRadius={10}
              onChangeText={text => {
                dispatch(setTableNumber(text));
              }}
              type="text"
              maxLength={30}
              placeholder="Contoh: A2, B3"
            />
          </Stack>
        </FormControl>
        {prevRoute?.name === 'EditOrderScreen' ? (
          <Text mt={2} ml={4}>
            Nama Customer : {customer_name}
          </Text>
        ) : null}
        {filteredItems.length > 0
          ? filteredItems.map(product => {
              return (
                <Product
                  key={product?.productId}
                  name={product?.name}
                  id={product?.productId}
                  onCheckout={true}
                  basePrice={product?.basePrice}
                  quantity={product?.quantity}
                  price={product?.basePrice}
                  photos={product?.photos}
                  toggle={false}
                  onCashier={false}
                  onEditNote={product?.note}
                  setNoteProduct={setNoteProduct}
                />
              );
            })
          : null}
      </ScrollView>

      <View
        borderTopWidth={1}
        borderTopColor={'gray.200'}
        bg={'#f4f5fa'}
        bottom={4}>
        <View p={2} mx={4} flexDirection={'row'}>
          <Text flex={screenWidth > 600 ? 10 : 4} bold>
            Total Tagihan
          </Text>
          <View alignItems={'flex-end'} flex={2}>
            <Text bold>{RupiahFormatter(totalSum)}</Text>
          </View>
        </View>
      </View>

      <View bottom={18} flexDirection={'row'} mx={4}>
        {prevRoute?.name === 'EditOrderScreen' ? null : (
          <View
            w={50}
            h={50}
            borderRadius={25}
            bg={'#fdecec'}
            justifyContent={'center'}
            alignItems={'center'}>
            <MaterialIcons
              onPress={() => setIsOpen(true)}
              name="delete"
              size={25}
              color="#ef4536"
            />
          </View>
        )}

        <View flex={1}>
          <Button
            isLoading={loading}
            isLoadingText="loading. . ."
            onPress={
              () =>
                prevRoute.name === 'EditOrderScreen'
                  ? setIsOpen(true)
                  : setModalVisible(true)
              // (navigation.navigate('PaymentMethodScreen')
            }
            borderRadius={34}
            ml={4}
            bg={primaryColor?.primaryColor}>
            <Text fontSize={'lg'} color="white">
              {prevRoute?.name === 'EditOrderScreen' ? 'Confirm' : 'Tagih'}
            </Text>
          </Button>
        </View>
      </View>

      <Modal isOpen={modalVisible} onClose={setModalVisible} size={'full'}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Isi Data Pemesan</Modal.Header>
          <Modal.Body>
            <FormControl isRequired>
              <Stack>
                <FormControl.Label>Nama </FormControl.Label>
                <Input
                  bg={'white'}
                  borderRadius={10}
                  onChangeText={text => dispatch(setCustomerName(text))}
                  type="text"
                  placeholder="Contoh: Budi"
                />
              </Stack>
              <Stack mt={4}>
                <FormControl.Label>No Handphone</FormControl.Label>
                <Input
                  bg={'white'}
                  borderRadius={10}
                  onChangeText={text => dispatch(setCustomerPhone(text))}
                  type="text"
                  placeholder="Contoh: 0812345678"
                />
              </Stack>
              <Stack mt={4}>
                <FormControl.Label>Email</FormControl.Label>
                <Input
                  bg={'white'}
                  borderRadius={10}
                  onChangeText={text => dispatch(setCustomerEmail(text))}
                  type="text"
                  placeholder="Contoh: mas@mail.com"
                />
              </Stack>
            </FormControl>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  setModalVisible(false);
                  onlineModule === true
                    ? singleSubmitPayment()
                    : navigation.navigate('PaymentMethodScreen');
                }}>
                Lewati
              </Button>
              <Button
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate('PaymentMethodScreen');
                  onlineModule === true
                    ? singleSubmitPayment()
                    : navigation.navigate('PaymentMethodScreen');
                }}>
                Simpan
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      <Center>
        <Modal
          size={'full'}
          isOpen={noteState}
          onClose={() => dispatch(setNote(false))}>
          <Modal.Content mb={0} mt={'auto'} maxWidth="400px">
            <Modal.CloseButton />
            <Modal.Header>{'Catatan'}</Modal.Header>
            <Modal.Body>
              <TextArea
                onChangeText={text => setNoteProduct(text)}
                h={20}
                mb={4}
                bg={'white'}
                value={noteProduct}
                borderRadius={10}
                placeholder="Contoh: nomor meja, nama, level pedas.."
                autoCompleteType={undefined}
              />
              <Button
                bg={primaryColor?.primaryColor}
                onPress={handleAddNote}
                leftIcon={<FontAwesome name="save" size={15} color="white" />}>
                Simpan Catatan
              </Button>
            </Modal.Body>
          </Modal.Content>
        </Modal>
      </Center>

      <Center>
        <Modal size={'full'} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <Modal.Content mb={0} mt={'auto'} maxWidth="400px">
            <Modal.CloseButton />
            <Modal.Header>
              {prevRoute?.name === 'EditOrderScreen'
                ? 'Konfirmasi Pesanan'
                : 'Hapus Pesanan ?'}
            </Modal.Header>
            <Modal.Body>
              <Text mb={4}>
                {prevRoute?.name === 'EditOrderScreen'
                  ? 'Pastikan pesanan sudah benar ?'
                  : 'Pastikan pesanan yang akan dihapus sudah dibatalkan pembeli'}
              </Text>
              <Button
                mb={4}
                bg={'#f04438'}
                onPress={() => {
                  prevRoute?.name === 'EditOrderScreen'
                    ? handleConfirm()
                    : navigation.goBack();
                  dispatch(clearCart());
                }}
                leftIcon={
                  <MaterialCommunityIcons
                    name={
                      prevRoute?.name === 'EditOrderScreen'
                        ? 'cart-check'
                        : 'delete-outline'
                    }
                    size={15}
                    color="white"
                  />
                }>
                {prevRoute?.name === 'EditOrderScreen' ? 'Konfirmasi' : 'Hapus'}
              </Button>
              <Button
                bg={'#fadedb'}
                onPress={() => setIsOpen(false)}
                leftIcon={
                  <MaterialIcons name="cancel" size={15} color="#e85844" />
                }>
                <Text color={'#f04438'}>Batal</Text>
              </Button>
            </Modal.Body>
          </Modal.Content>
        </Modal>
      </Center>
    </>
  );
};

export default CheckoutScreen;
