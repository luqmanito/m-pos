// HomeScreen.tsx

import React, {useState, useCallback} from 'react';
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
import AntDesign from 'react-native-vector-icons/AntDesign';
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
import {setNote, setTableNumber} from '../../Redux/Reducers/button';
import {screenWidth} from '../../App';

export const CheckoutScreen: React.FC = () => {
  const cartItems = useSelector((state: RootState) => state.cartSlice.items);
  const totalSum = cartItems.reduce((sum, item) => sum + item.subTotal, 0);
  const filteredItems = cartItems.filter(item => item.quantity > 0);
  const [noteProduct, setNoteProduct] = useState<string>('');

  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      dispatch(clearStateProduct());
      dispatch(clearDataCamera());
    }, [dispatch]),
  );

  const noteState = useSelector((state: RootState) => state.buttonSlice?.note);

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

  const navigation = useNavigation<NavigationProp<any>>();
  return (
    <>
      <NavBar msg="Ringkasan Pesanan" />
      <ScrollView mb={8}>
        <FormControl>
          <Stack mx={4} mt={4}>
            <FormControl.Label>
              Nomor Meja <Text fontWeight={'light'}>{'(opsional)'}</Text>
            </FormControl.Label>
            <Input
              bg={'#f4f5fa'}
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

        <View flex={1}>
          <Button
            // onPress={() => navigation.navigate('PaymentScreen')}
            onPress={() => navigation.navigate('PaymentMethodScreen')}
            borderRadius={34}
            ml={4}
            bg={'#0c50ef'}>
            <Text fontSize={'lg'} color="white">
              Tagih
            </Text>
          </Button>
        </View>
      </View>

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
                bg={'#0c50ef'}
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
            <Modal.Header>{'Hapus Pesanan ?'}</Modal.Header>
            <Modal.Body>
              <Text mb={4}>
                Pastikan pesanan yang akan dihapus sudah dibatalkan pembeli.
              </Text>
              <Button
                mb={4}
                bg={'#f04438'}
                onPress={() => {
                  navigation.goBack();
                  dispatch(clearCart());
                }}
                leftIcon={<AntDesign name="delete" size={15} color="white" />}>
                Hapus
              </Button>
              <Button
                bg={'#fadedb'}
                onPress={handleAddNote}
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
