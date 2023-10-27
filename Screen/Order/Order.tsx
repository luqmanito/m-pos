import React, {useState, useCallback, useEffect, useContext} from 'react';
import {
  View,
  Button,
  Text,
  Input,
  Center,
  Image,
  Divider,
  HStack,
  Badge,
  FlatList,
  Pressable,
  Icon,
  Modal,
} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import shop from '../../Public/Assets/shop.png';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  useNavigation,
  NavigationProp,
  useFocusEffect,
} from '@react-navigation/native';
import _ from 'lodash';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {clearStateProduct} from '../../Redux/Reducers/product';
import {useDispatch} from 'react-redux';
import {clearDataCamera} from '../../Redux/Reducers/upload';
import noImage from '../../Public/Assets/no-Image.jpg';
import RupiahFormatter from '../../Components/Rupiah/Rupiah';
import formatDate from '../../Components/Date/Date';
import {
  setCustomerName,
  setSelectedId,
  setTableNumber,
} from '../../Redux/Reducers/button';
import useOrders from '../../Hooks/useOrders';
import {PrimaryColorContext, useLoading} from '../../Context';
import {RenderFooter} from '../../Components/RenderFooter/RenderFooter';
import {RenderSkeletonItems} from './Components/Loading';
import {OrderModel} from '../../models/OrderModel';
import FastImage from 'react-native-fast-image';
import {screenWidth} from '../../App';
import useNetworkInfo from '../../Hooks/useNetworkInfo';
import useDataSubmission from '../../Hooks/useDataSubmission';
import usePaymentSubmit from '../../Hooks/useSubmitPayment';
import {clearCart, updateCartItemQuantity} from '../../Redux/Reducers/cart';
import {PhotoModel} from '../../models/PhotoModel';
import useUserInfo from '../../Hooks/useUserInfo';

export interface Product {
  id: number;
  order_id: number;
  product_id: number;
  name: string;
  quantity: number;
  price: number;
  created_at: string;
  updated_at: string;
  deleted_at: any;
  note: any;
  product: Product2;
}

export interface Product2 {
  id: number;
  business_id: number;
  name: string;
  code: string;
  description: string;
  price: number;
  created_at: string;
  updated_at: string;
  deleted_at: any;
  category_id: number;
  is_subtract: boolean;
  quantity: number;
  photos: PhotoModel[];
}

interface Item {
  id: string;
  order_code: string;
  products: Product[];
  created_at: string;
  total: number;
  table_no: string;
  customer_name: string;
}

interface Props {
  item: Item;
}

export const OrderScreen: React.FC = () => {
  const skeletonItems = RenderSkeletonItems(screenWidth);
  const {loading} = useLoading();
  const [isOpen, setIsOpen] = useState(false);

  const [filterName, setFilterName] = useState('Pending');
  const [selectedFilter, setSelectedFilter] = useState('Pending');
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('Tab1');
  const [searchResults, setSearchResults] = useState('');
  // const [activeMethod, setActiveMethod] = useState('method1');
  const {
    orders,
    handleSearch,
    fetchOrdersByStatus,
    newFetchData,
    handleRefresh,
    emptyData,
  } = useOrders();
  const {submitPayment} = usePaymentSubmit();
  const debouncedFetchProducts = _.debounce(handleSearch, 300);
  const {cacheDataSubmissions} = useDataSubmission();
  const {onlineModule} = useUserInfo();
  const primaryColor = useContext(PrimaryColorContext);
  useEffect(() => {
    debouncedFetchProducts(searchResults);
    return () => debouncedFetchProducts.cancel();
  }, [debouncedFetchProducts, searchResults]);

  useFocusEffect(
    useCallback(() => {
      dispatch(clearStateProduct());
      dispatch(clearDataCamera());
    }, [dispatch]),
  );

  const renderFooter = () => {
    if (loading) {
      return <RenderFooter />;
    }
    return null;
  };

  const renderSkeletonItems = () => {
    return (
      <>
        {skeletonItems.map((item, index) => (
          <React.Fragment key={index}>{item}</React.Fragment>
        ))}
      </>
    );
  };

  const transformProductToItem = (order: OrderModel) => ({
    order_code: order.order_code,
    products: order.products,
    id: order.id.toString(),
    total: order.total,
    created_at: order.created_at,
    table_no: order.table_no,
    customer_name: order.customer_name,
  });

  const renderItem: React.FC<Props> = ({item}) => (
    <>
      <View
        key={item?.id}
        mt={4}
        mx={4}
        borderRadius={10}
        borderTopColor={'gray.200'}
        bg={'white'}>
        <View my={4} flexDirection={'row'}>
          <Text mx={4} fontSize={'lg'} flex={10} color={'#848aac'} bold>
            {item?.order_code}
          </Text>
          <View justifyContent={'center'} alignItems={'center'} flex={2}>
            <Badge
              colorScheme="success"
              alignSelf="center"
              borderRadius={14}
              variant={'subtle'}>
              <Text bold color={'#2ebd53'}>
                {filterName}
              </Text>
            </Badge>
          </View>
        </View>
        <Divider />
        <View mx={4} mt={4} bg="white">
          <HStack mx={4}>
            <View>
              {item?.products[0]?.product?.photos.length !== 0 ? (
                <FastImage
                  style={styles.image}
                  source={{
                    uri: item?.products[0]?.product?.photos[0]?.original_url,
                    priority: FastImage.priority.normal,
                  }}
                  resizeMode={FastImage.resizeMode.contain}
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
              <Text bold>{item?.products[0]?.name}</Text>
              <Text color={'#bfbfcf'}>{formatDate(item?.created_at)}</Text>
              <Text color={'#848aac'} bold>
                {`${
                  item?.products.length > 1
                    ? `+${item?.products?.length - 1} produk lainnya`
                    : ''
                }`}
              </Text>
            </View>
          </HStack>
          <Text bold mb={2} mt={2} mx={4}>
            {RupiahFormatter(item?.total)}
            <Text
              color={'#848aac'}>{` (${item?.products.length} Produk)`}</Text>
          </Text>
          <Button
            isDisabled={filterName === 'Confirm'}
            onPress={() => {
              navigation.navigate('EditOrderScreen');
              dispatch(clearCart());
              dispatch(setTableNumber(item?.table_no));
              dispatch(setCustomerName(item?.customer_name));
              item?.products.map(listOrder => {
                dispatch(
                  updateCartItemQuantity({
                    productId: listOrder?.product_id,
                    quantity: listOrder?.quantity,
                    subTotal: listOrder?.quantity * listOrder?.price,
                    name: listOrder?.name,
                    photos: listOrder?.product?.photos[0]?.original_url,
                    basePrice: listOrder?.price,
                    note: listOrder?.note,
                  }),
                );
              });
              dispatch(setSelectedId(item?.id));
            }}
            mt={2}
            mb={4}
            borderRadius={20}
            bg={primaryColor?.primaryColor}>
            <Text color={'white'} bold>
              Edit Order
            </Text>
          </Button>
        </View>
      </View>
    </>
  );
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
        paddingTop={30}>
        <View flexDirection={'row'} alignItems={'center'}>
          <Text color={'black'} fontSize={'3xl'} bold>
            Pesanan
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

      <View mx={5}>
        <Input
          mt={4}
          bg={'white'}
          placeholder="Cari Produk"
          placeholderTextColor={'#888888'}
          variant="filled"
          value={searchResults}
          onChangeText={text => {
            setSearchResults(text);
          }}
          width="100%"
          borderRadius="10"
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
      </View>
      <View mx={6} mt={4} flexDirection={'row'}>
        {onlineModule ? (
          <Pressable
            p={2}
            bg={activeTab === 'Tab1' ? primaryColor?.secondaryColor : null}
            w={'50%'}
            borderRadius={20}
            onPress={() => {
              fetchOrdersByStatus('pending', 'ONLINE');
              setFilterName('Pending');
              setActiveTab('Tab1');
            }}>
            <Text
              textAlign={'center'}
              bold
              color={primaryColor?.primaryColor}
              borderRadius={20}>
              Online
            </Text>
          </Pressable>
        ) : null}

        <Pressable
          onPress={() => {
            fetchOrdersByStatus('confirm', 'OFFLINE');
            setActiveTab('Tab2');
          }}
          p={2}
          bg={activeTab === 'Tab2' ? primaryColor?.secondaryColor : null}
          w={onlineModule ? '50%' : 'full'}
          borderRadius={20}>
          <Text
            textAlign={'center'}
            bold
            color={primaryColor?.primaryColor}
            borderRadius={20}>
            Offline
          </Text>
        </Pressable>
      </View>
      {loading ? (
        <>{renderSkeletonItems()}</>
      ) : activeTab === 'Tab1' ? (
        <>
          <View mt={4}>
            <View p={2} mx={4} flexDirection={'row'}>
              <View alignItems={'flex-end'} flex={2}>
                <Center borderRadius={20}>
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
                      value={filterName ? filterName : 'Pending'}
                      InputRightElement={
                        <Icon
                          as={<AntDesign name={'down'} />}
                          size={4}
                          mr="2"
                          color={primaryColor?.primaryColor}
                        />
                      }
                      InputLeftElement={
                        <Icon
                          as={<FontAwesome name={'filter'} />}
                          size={4}
                          ml="2"
                          color={primaryColor?.primaryColor}
                        />
                      }
                    />
                  </TouchableOpacity>
                </Center>
              </View>
            </View>
          </View>
          {orders.length > 0 ? (
            <FlatList
              data={orders.map(transformProductToItem)}
              renderItem={renderItem}
              keyExtractor={item => item?.id.toString()}
              ListFooterComponent={renderFooter}
              onRefresh={handleRefresh}
              refreshing={false}
              onEndReached={
                orders.length > 2 && emptyData === false ? newFetchData : null
              }
              onEndReachedThreshold={0}
            />
          ) : orders.length === 0 && searchResults ? (
            <View mt={12} justifyContent={'center'} alignItems={'center'}>
              <Text bold> Tidak Ada Data Ditemukan</Text>
            </View>
          ) : (
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
          )}
        </>
      ) : (
        <>
          {orders.length > 0 ? (
            <FlatList
              data={orders.map(transformProductToItem)}
              renderItem={renderItem}
              keyExtractor={item => item?.id.toString()}
              ListFooterComponent={renderFooter}
              onRefresh={handleRefresh}
              refreshing={false}
              onEndReached={
                orders.length > 2 && emptyData === false ? newFetchData : null
              }
              onEndReachedThreshold={0}
            />
          ) : orders.length === 0 && searchResults ? (
            <View mt={12} justifyContent={'center'} alignItems={'center'}>
              <Text bold> Tidak Ada Data Ditemukan</Text>
            </View>
          ) : (
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
          )}
        </>
      )}
      {activeTab === 'Tab2' && cacheDataSubmissions?.length > 0 ? (
        <View
          p={2}
          position={'absolute'}
          alignSelf="center"
          bottom={18}
          flexDirection={'row'}>
          <Button
            isDisabled={cacheDataSubmissions?.length === 0 ? true : false}
            isLoading={loading}
            isLoadingText={'loading'}
            borderRadius={20}
            bg={primaryColor?.primaryColor}
            onPress={() => submitPayment(cacheDataSubmissions)}>
            <Text
              bold
              fontSize={'2xl'}
              textAlign={'center'}
              color="white"
              flex={2}>
              <MaterialIcons name="send" size={20} color="white" />
              Kirim Semua Data Transaksi
            </Text>
          </Button>
        </View>
      ) : null}
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
                  setSelectedFilter('Pending');
                }}>
                <View flexDirection={'row'}>
                  <Text flex={11} mb={2}>
                    Pending
                  </Text>
                  <View flex={1} mb={2}>
                    {selectedFilter === 'Pending' ? (
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
                  setSelectedFilter('Confirm');
                }}>
                <View flexDirection={'row'}>
                  <Text flex={11} mb={2}>
                    Confirm
                  </Text>
                  <View flex={1} mb={2}>
                    {selectedFilter === 'Confirm' ? (
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
                  // handleCategory(selectedCategories);
                  // filterOfflineProductsByCategory(selectedCategories);
                  setFilterName(selectedFilter);
                  fetchOrdersByStatus(selectedFilter, 'ONLINE');
                  setIsOpen(false);
                  // dispatch(setCategoryName(categoriesName));
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  iconSearch: {
    marginLeft: 5,
  },
  iconCart: {
    marginTop: 4,
    marginRight: 5,
  },
  image: {
    width: 80,
    height: 80,
  },
  wifi: {
    marginLeft: 10,
    color: '#2dbf52',
  },
  wifi_off: {
    marginLeft: 10,
    color: '#fc2b0c',
  },
});
