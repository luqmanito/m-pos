import {HStack, Image, Switch, Text, View} from 'native-base';
import React, {FunctionComponent, useContext} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FastImage from 'react-native-fast-image';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import noImage from '../../Public/Assets/no-Image.jpg';
import {Pressable} from 'react-native';
import RupiahFormatter from '../Rupiah/Rupiah';
import {useDispatch, useSelector} from 'react-redux';
import {updateCartItemQuantity} from '../../Redux/Reducers/cart';
import {RootState} from '../../Redux/store';
import {setActiveId, setNote} from '../../Redux/Reducers/button';
import useNetworkInfo from '../../Hooks/useNetworkInfo';
import {PrimaryColorContext} from '../../Context';

type ProductProps = {
  name: string | undefined;
  price: number;
  basePrice: number | undefined;
  quantity?: number;
  photos: string | undefined;
  toggle: boolean;
  id: number | undefined;
  msg?: string;
  onCashier: boolean;
  onEditNote?: string;
  onCheckout?: boolean;
  active?: boolean;
  setNoteProduct?: (newNote: string) => void;
};

const Product: FunctionComponent<ProductProps> = ({
  name,
  price,
  id,
  photos,
  toggle,
  onCashier,
  quantity,
  active,
  onCheckout,
  onEditNote,
  setNoteProduct,
}) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cartSlice.items);
  const detailQty = cartItems.find(item => item.productId === id);
  const isConnected = useNetworkInfo().isConnected;
  const primaryColor = useContext(PrimaryColorContext);
  const handleIncreaseQuantity = (productId: number) => {
    const cartItem = cartItems.find(item => item.productId === productId);
    if (cartItem) {
      dispatch(
        updateCartItemQuantity({
          productId,
          quantity: cartItem.quantity + 1,
          subTotal: (cartItem?.quantity + 1) * price,
          name,
          photos,
          basePrice: price,
          note: '',
        }),
      );
    }
    if (!cartItem) {
      dispatch(
        updateCartItemQuantity({
          productId,
          quantity: 1,
          subTotal: price,
          name,
          photos,
          basePrice: price,
          note: '',
        }),
      );
    }
  };

  const handleDecreaseQuantity = (productId: number) => {
    const cartItem = cartItems.find(item => item.productId === productId);
    if (cartItem) {
      dispatch(
        updateCartItemQuantity({
          productId,
          quantity: cartItem.quantity - 1,
          subTotal: (cartItem?.quantity - 1) * price,
          name,
          photos,
          basePrice: price,
          note: '',
        }),
      );
    }
  };
  const handleNotes = (): void => {
    dispatch(setActiveId(id));
    dispatch(setNote(true));
    if (setNoteProduct) {
      setNoteProduct(
        onEditNote ? onEditNote : detailQty?.note ? detailQty?.note : '',
      );
    }
  };

  return (
    <React.Fragment key={id}>
      <View minW={350} mx={4} mt={4} bg="white" borderRadius={15}>
        <HStack mx={4}>
          <View>
            {photos && !isConnected ? (
              // <FastImage
              //   style={styles.image}
              //   source={{
              //     uri: photos,
              //     priority: FastImage.priority.normal,
              //   }}
              //   resizeMode={FastImage.resizeMode.contain}
              //   fallback={noImage}
              // />
              <Image
                source={noImage}
                alt={'foto-produk'}
                style={styles.image}
                resizeMode="contain"
              />
            ) : photos && isConnected ? (
              <FastImage
                style={styles.image}
                source={{
                  uri: photos,
                  priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.contain}
                fallback={noImage}
              />
            ) : (
              <Image
                source={noImage}
                alt={'foto-produk'}
                style={styles.image}
                resizeMode="contain"
              />
            )}
          </View>
          <View mx={4} my={4}>
            <Text>
              {name}
              <Text fontWeight={'light'}>
                {onCheckout ? ` ( ${quantity} barang)` : null}
              </Text>
            </Text>
            <Text>{RupiahFormatter(price)}</Text>
          </View>
          {toggle ? (
            <View
              flex={1}
              my={4}
              justifyContent={'flex-end'}
              alignItems={'flex-end'}>
              <Switch
                disabled={true}
                defaultIsChecked={active}
                colorScheme={'emerald'}
                size="lg"
              />
            </View>
          ) : onCashier ? (
            <View
              flex={1}
              my={4}
              position={'relative'}
              justifyContent={'flex-end'}
              flexDirection={'row'}
              alignItems={'flex-end'}>
              <Pressable
                disabled={detailQty?.quantity === 0 ? true : false}
                onPress={() => {
                  if (id !== undefined) {
                    handleDecreaseQuantity(id);
                  }
                }}>
                <AntDesign
                  name="minuscircle"
                  size={25}
                  style={styles.iconLeft}
                  color={primaryColor?.primaryColor}
                />
              </Pressable>
              <Text bold mx={1} mb={1}>
                {!detailQty?.quantity ? 0 : detailQty?.quantity}
              </Text>
              <Pressable
                onPress={() => {
                  if (id !== undefined) {
                    handleIncreaseQuantity(id);
                  }
                }}>
                <AntDesign
                  name="pluscircle"
                  size={25}
                  style={styles.iconRight}
                  color={primaryColor?.primaryColor}
                />
              </Pressable>
            </View>
          ) : null}
        </HStack>
        {onCheckout && !detailQty?.note ? (
          <Pressable onPress={() => handleNotes()}>
            <Text mb={2} mt={2} mx={4}>
              <MaterialIcons
                name="note-add"
                size={15}
                color={primaryColor?.primaryColor}
              />
              Tambah Catatan
            </Text>
          </Pressable>
        ) : onCheckout && detailQty?.note ? (
          <>
            <View
              borderRadius={10}
              mx={4}
              mt={8}
              p={2}
              alignSelf="center"
              bottom={18}
              flexDirection={'row'}
              bg={'#f4f5fa'}>
              <Text ml={4} color="black" flex={2}>
                {detailQty.note}
              </Text>
              <Pressable
                onPress={() => {
                  handleNotes();
                }}>
                <MaterialIcons
                  name="edit"
                  style={styles.iconCart}
                  size={15}
                  color={primaryColor?.primaryColor}
                />
              </Pressable>
            </View>
          </>
        ) : null}
      </View>
    </React.Fragment>
  );
};

export default Product;

const styles = {
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  image: {
    width: 130,
    height: 130,
  },
  iconCart: {
    marginTop: 4,
    marginRight: 5,
  },
};
