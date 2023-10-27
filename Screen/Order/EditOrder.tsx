import React, {useState, useCallback, useContext} from 'react';
import {
  View,
  Button,
  Text,
  Input,
  Center,
  Image,
  ScrollView,
  Icon,
  PresenceTransition,
  FlatList,
  HStack,
  Spinner,
  Heading,
  Modal,
  Divider,
  Skeleton,
} from 'native-base';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import _ from 'lodash';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import shop from '../../Public/Assets/shop.png';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  useNavigation,
  NavigationProp,
  useFocusEffect,
} from '@react-navigation/native';

import {Pressable, TouchableOpacity} from 'react-native';
import {clearStateProduct, setCategoryName} from '../../Redux/Reducers/product';
import {useDispatch, useSelector} from 'react-redux';
import {clearDataCamera} from '../../Redux/Reducers/upload';

import Product from '../../Components/Product/Product';
import {ProductModel} from '../../models/ProductModel';
import {RootState} from '../../Redux/store';
import {clearCart} from '../../Redux/Reducers/cart';
import RupiahFormatter from '../../Components/Rupiah/Rupiah';
import useCategories from '../../Hooks/useCategory';
import useProducts from '../../Hooks/useProducts';
import {PrimaryColorContext, useLoading} from '../../Context';
import {screenWidth} from '../../App';
import useNetworkInfo from '../../Hooks/useNetworkInfo';
import useScreenOrientation from '../../Hooks/useScreenOrientation';

export const EditOrderScreen: React.FC = () => {
  const {loading} = useLoading();
  const primaryColor = useContext(PrimaryColorContext);
  const skeletonCount = 10;
  const cartItems = useSelector((state: RootState) => state.cartSlice.items);
  const totalSum = cartItems.reduce((sum, item) => sum + item.subTotal, 0);
  const filteredItems = cartItems.filter(item => item.quantity > 0);
  const categoryName = useSelector(
    (state: RootState) => state.productSlice?.categoryName,
  );
  const {
    productCashier,
    // handleSearch,
    newFetchData,
    // handleCategory,
    searchOfflineProductsByName,
    filterOfflineProductsByCategory,
    fetchAllProductsCache,
    handleRefresh,
    emptyData,
  } = useProducts('cashier');
  const {categories, fetchCategories} = useCategories();
  const orientation = useScreenOrientation();
  const numProducts = screenWidth > 600 ? 11 : 4;
  const [selectedCategories, setSelectedCategories] = useState(0);
  const [categoriesName, setCategoriesName] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [searchResults, setSearchResults] = useState('');
  const [activeTab, setActiveTab] = useState('Tab1');
  const dispatch = useDispatch();

  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
  };

  useFocusEffect(
    useCallback(() => {
      dispatch(clearStateProduct());
      dispatch(clearDataCamera());
    }, [dispatch]),
  );

  function numOfColumns() {
    if (screenWidth > 600) {
      if (orientation === 'portrait') {
        return 2;
      } else {
        return 3;
      }
    } else {
      return 1;
    }
  }

  interface Item {
    name: string;
    price: number;
    id: number;
    photos: {
      original_url: string;
    }[];
  }

  const transformProductToItem = (products: ProductModel): Item => {
    return {
      name: products.name,
      price: products.price,
      id: products.id,
      photos: products.photos
        ? products.photos.map(photo => ({
            original_url: photo.original_url,
          }))
        : [],
    };
  };

  interface Props {
    item: Item;
  }

  const renderItem: React.FC<Props> = ({item}) => (
    <>
      <Product
        name={item?.name}
        key={item?.id}
        price={item?.price}
        id={item?.id}
        basePrice={item?.price}
        photos={item.photos ? item?.photos[0]?.original_url : ''}
        toggle={false}
        onCashier={true}
      />
    </>
  );

  const renderSkeletonItems = () => {
    return Array.from({length: skeletonCount}, (unused, index) => (
      <React.Fragment key={index}>
        {screenWidth > 600 ? (
          <View
            flexDirection={'row'}
            justifyContent={'center'}
            alignItems={'center'}
            mt={2}
            key={index}>
            <Skeleton flex={1} p={3} minH="145" maxW={370} rounded={'full'} />
            <Skeleton flex={1} p={3} minH="145" maxW={370} rounded={'full'} />
            <Skeleton flex={1} p={3} minH="145" maxW={370} rounded={'full'} />
          </View>
        ) : (
          <View key={index}>
            <Skeleton p={2} h="125" rounded={'full'} />
          </View>
        )}
      </React.Fragment>
    ));
  };

  const renderFooter = () => {
    if (loading) {
      return (
        <HStack mt={5} space={2} justifyContent="center">
          <Spinner color={'#A72185'} accessibilityLabel="Loading posts" />
          <Heading color="#A72185" fontSize="md">
            Loading
          </Heading>
        </HStack>
      );
    }
    return null;
  };
  const isConnected = useNetworkInfo().isConnected;

  const navigation = useNavigation<NavigationProp<any>>();
  return (
    <>
      <View
        width={'100%'}
        flexDirection={'row'}
        justifyContent={'space-between'}
        alignItems={'center'}
        paddingX={5}
        py={5}
        paddingTop={30}>
        <View flexDirection={'row'} alignItems={'center'}>
          <Text color={'black'} fontSize={'3xl'} bold>
            Edit Order
          </Text>
          <View>
            <MaterialCommunityIcons
              name={isConnected ? 'wifi-check' : 'wifi-remove'}
              size={24}
              color="#fff"
              style={isConnected ? styles.wifi : styles.wifi_off}
            />
          </View>
        </View>
      </View>
      <View mx={2} my={2} mt={4} flexDirection={'row'}>
        <Center px={2} w={'50%'} borderRadius={20}>
          <TouchableOpacity onPress={() => handleTabPress('Tab1')}>
            <Input
              bg={'white'}
              placeholder="Cari Produk"
              placeholderTextColor={'#888888'}
              variant="filled"
              value={searchResults}
              onChangeText={text => {
                setSearchResults(text);
                searchOfflineProductsByName(text);
              }}
              width="100%"
              borderRadius="13"
              py="1"
              px="1"
              InputLeftElement={
                <Ionicons
                  style={styles.iconSearch}
                  name="search"
                  size={20}
                  color={primaryColor?.primaryColor}
                />
              }
            />
          </TouchableOpacity>
        </Center>
        <Center px={2} w={'50%'} borderRadius={20}>
          <TouchableOpacity onPress={() => setIsOpen(true)}>
            <Input
              bg={'white'}
              w={'100%'}
              borderRadius={10}
              borderWidth="0"
              py="1"
              px="1"
              isReadOnly={true}
              variant={'filled'}
              type="text"
              placeholder="Pilih Kategori"
              value={categoryName ? categoryName : 'Semua Produk'}
              InputRightElement={
                <Icon
                  as={<AntDesign name={'down'} />}
                  size={4}
                  mr="2"
                  color={primaryColor?.primaryColor}
                />
              }
            />
          </TouchableOpacity>
        </Center>
      </View>
      {loading ? (
        <>{renderSkeletonItems()}</>
      ) : activeTab === 'Tab1' ? (
        <View
          flex={1}
          justifyContent={screenWidth > 600 ? 'center' : null}
          alignItems={screenWidth > 600 ? 'center' : null}
          mb={10}>
          {productCashier?.length > 0 ? (
            <FlatList
              key={numOfColumns()}
              data={productCashier.map(transformProductToItem)}
              renderItem={renderItem}
              keyExtractor={item => item.id.toString()}
              numColumns={numOfColumns()}
              ListFooterComponent={renderFooter}
              onRefresh={handleRefresh}
              refreshing={false}
              onEndReached={
                productCashier.length > numProducts && emptyData === false
                  ? newFetchData
                  : null
              }
              onEndReachedThreshold={0}
            />
          ) : productCashier?.length === 0 && searchResults ? (
            <View mt={12} justifyContent={'center'} alignItems={'center'}>
              <Text bold> Tidak Ada Data Ditemukan</Text>
            </View>
          ) : (
            <View mt={12} justifyContent={'center'} alignItems={'center'}>
              <Image
                source={shop}
                alt={'logo-pemkab'}
                // w={'80%'}
                resizeMode="contain"
              />

              <Center>
                <Text bold fontSize={22} numberOfLines={2}>
                  Yuk, Tambah Produk Jualanmu
                </Text>
                <Text mt={2} numberOfLines={2} color={'#888888'} fontSize={16}>
                  Semua produk yang kamu jual bisa diatur dari sini
                </Text>
              </Center>
            </View>
          )}
        </View>
      ) : (
        <ScrollView>
          {
            <View mt={12} justifyContent={'center'} alignItems={'center'}>
              <Image
                source={shop}
                alt={'logo-pemkab'}
                w={'80%'}
                resizeMode="contain"
              />

              <Center>
                <Text bold fontSize={22} numberOfLines={2}>
                  Yuk, Tambah Produk Jualanmu
                </Text>
                <Text mt={2} numberOfLines={2} color={'#888888'} fontSize={16}>
                  Semua produk yang kamu jual bisa diatur dari sini
                </Text>
              </Center>
            </View>
          }
        </ScrollView>
      )}
      {totalSum === 0 ? null : (
        <Pressable onPress={() => navigation.navigate('CheckoutScreen')}>
          <PresenceTransition
            visible={totalSum === 0 ? false : true}
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
              transition: {
                duration: 250,
              },
            }}>
            <View
              borderRadius={34}
              p={2}
              w={'90%'}
              position={'absolute'}
              alignSelf="center"
              bottom={18}
              flexDirection={'row'}
              bg={primaryColor?.primaryColor}>
              <Text ml={4} color="white" flex={2}>
                {filteredItems.length + ' Produk'}
              </Text>
              <Center mx={2}>
                <Text flex={1} fontSize={'md'} color="white">
                  {RupiahFormatter(totalSum)}
                </Text>
              </Center>
              <MaterialIcons
                name="shopping-cart"
                style={styles.iconCart}
                size={15}
                color="white"
              />
            </View>
          </PresenceTransition>
        </Pressable>
      )}
      <Center>
        <Modal size={'full'} isOpen={isOpen} onClose={() => setIsOpen(false)}>
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
                  setCategoriesName('Semua Produk');
                  setSelectedCategories(0);
                }}>
                <View flexDirection={'row'}>
                  <Text flex={11} mb={2}>
                    Semua Produk
                  </Text>
                  <View flex={1} mb={2}>
                    {selectedCategories === 0 ? (
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
              {categories?.map(item => {
                return (
                  <Pressable
                    key={item?.id}
                    onPress={() => {
                      setCategoriesName(item?.name);
                      setSelectedCategories(item?.id);
                    }}>
                    <View key={item?.id}>
                      <View flexDirection={'row'} my={2}>
                        <Text flex={11}>{item?.name}</Text>
                        <View flex={1}>
                          {selectedCategories === item?.id ? (
                            <AntDesign
                              name={'checkcircle'}
                              size={20}
                              color={primaryColor?.primaryColor}
                            />
                          ) : null}
                        </View>
                      </View>
                      <Divider />
                    </View>
                  </Pressable>
                );
              })}
              <Button
                mt={4}
                onPress={() => {
                  // handleCategory(selectedCategories);
                  filterOfflineProductsByCategory(selectedCategories);
                  setIsOpen(false);
                  dispatch(setCategoryName(categoriesName));
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
      </Center>
    </>
  );
};

const styles = {
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  icon: {
    marginLeft: 15,
  },
  iconCart: {
    marginTop: 4,
    marginRight: 5,
  },
  iconSearch: {
    marginLeft: 5,
  },
  wifi: {
    marginLeft: 10,
    color: '#2dbf52',
  },
  wifi_off: {
    marginLeft: 10,
    color: '#fc2b0c',
  },
};
