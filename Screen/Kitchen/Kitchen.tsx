import React, {useState, useCallback, useEffect, useContext} from 'react';
import {
  View,
  Button,
  Text,
  Input,
  Image,
  ScrollView,
  Divider,
  HStack,
  Badge,
  FlatList,
  Pressable,
  Skeleton,
  Modal,
} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  useNavigation,
  NavigationProp,
  useFocusEffect,
} from '@react-navigation/native';
import _ from 'lodash';
import {StyleSheet} from 'react-native';
import {clearStateProduct} from '../../Redux/Reducers/product';
import {useDispatch, useSelector} from 'react-redux';
import {clearDataCamera} from '../../Redux/Reducers/upload';
import noImage from '../../Public/Assets/no-Image.jpg';
import formatDate from '../../Components/Date/Date';
import {setActiveId} from '../../Redux/Reducers/button';
import useOrders from '../../Hooks/useOrders';
import {PrimaryColorContext, useLoading} from '../../Context';
import {RenderFooter} from '../../Components/RenderFooter/RenderFooter';
import {OrderModel} from '../../models/OrderModel';
import FastImage from 'react-native-fast-image';
import {screenWidth} from '../../App';
import useNetworkInfo from '../../Hooks/useNetworkInfo';
import usePaymentSubmit from '../../Hooks/useSubmitPayment';
import useOrderDetails from '../../Hooks/useOrderDetail';
import {RenderSkeletonKitchen} from './Components/KitchenLoading';
import useUserInfo from '../../Hooks/useUserInfo';
import PrintReceipt from '../Printer/Components/PrintReceipt';
import {RootState} from '../../Redux/store';

interface Product {
  product: any;
  name: string;
}

interface Item {
  id: string;
  order_code: string;
  products: Product[];
  created_at: string;
  total: number;
  status: string;
}

interface Props {
  item: Item;
}

export const KitchenScreen: React.FC = () => {
  const skeletonItems = RenderSkeletonKitchen(screenWidth);
  const {loading} = useLoading();
  const dispatch = useDispatch();
  const {orderReady, orderCompleted} = usePaymentSubmit();
  const [searchResults, setSearchResults] = useState('');
  const {handleSearch, newFetchData, handleRefresh, emptyData} = useOrders();
  const {userData} = useUserInfo();
  const orderDetail = useOrderDetails()?.orders;
  const isLoading = useOrderDetails()?.isLoading;
  const debouncedFetchProducts = _.debounce(handleSearch, 300);
  const primaryColor = useContext(PrimaryColorContext);
  const [modalVisible, setModalVisible] = useState(false);
  const orderItems = useSelector((state: RootState) => state.orderSlice.orders);
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

  const renderDetailItems = () => {
    return (
      <>
        <View
          ml={screenWidth > 600 ? 4 : 0}
          pb={screenWidth > 600 ? '48' : 0}
          alignItems={'center'}
          w={screenWidth > 600 ? '70%' : 'full'}>
          <Text bold fontSize={'2xl'}>
            Detail Pesanan
          </Text>
          {isLoading ? (
            <Skeleton p={3} minH="545" />
          ) : (
            <ScrollView w={'100%'}>
              {orderDetail?.products?.map((item, index) => {
                return (
                  <View
                    key={item?.id}
                    mb={index === orderDetail?.products?.length - 1 ? 8 : 0}
                    mt={index === 0 ? 4 : 0}
                    pb={4}
                    mx={4}
                    borderBottomRadius={
                      index === orderDetail?.products?.length - 1 ? 10 : 0
                    }
                    borderTopRadius={index === 0 ? 10 : 0}
                    borderTopColor={'gray.200'}
                    bg={'white'}>
                    {index === 0 ? (
                      <View my={4} flexDirection={'row'}>
                        <Text
                          mx={4}
                          fontSize={'lg'}
                          flex={2}
                          color={'black'}
                          bold>
                          Daftar Pesanan
                        </Text>
                      </View>
                    ) : null}

                    <View
                      mt={index === 0 ? 0 : 4}
                      mb={index === 0 ? 0 : 4}
                      mx={4}>
                      <HStack py={2} mx={4}>
                        <View>
                          {item?.product?.photos.length !== 0 ? (
                            <FastImage
                              style={styles.image}
                              source={{
                                uri: item?.product?.photos[0]?.original_url,
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
                          <Text bold>{item?.name}</Text>
                          <Text color={'#848aac'} bold>
                            {`${item?.quantity} Porsi`}
                          </Text>
                        </View>
                      </HStack>
                      {item?.note ? (
                        <View
                          borderRadius={10}
                          mx={4}
                          mb={4}
                          p={2}
                          alignSelf="center"
                          flexDirection={'row'}
                          bg={'#f4f5fa'}>
                          <Text ml={4} color="black" flex={2}>
                            {item?.note}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                    {index === orderDetail?.products?.length - 1 ? null : (
                      <Divider mx={4} w={'90%'} />
                    )}
                  </View>
                );
              })}
              <Button
                isLoading={loading}
                isLoadingText="Loading"
                onPress={() => {
                  userData?.role === 'CASHIER'
                    ? (orderCompleted(), setModalVisible(false))
                    : (orderReady(), setModalVisible(false));
                }}
                mx={4}
                mb={4}
                borderRadius={10}
                bg={primaryColor?.primaryColor}>
                <Text color={'white'} bold>
                  {userData?.role === 'CASHIER'
                    ? 'Pesanan Selesai'
                    : 'Pesanan Siap'}
                </Text>
              </Button>
              {userData?.role === 'CASHIER' ? (
                <View bg={'#f4f5fa'}>
                  <PrintReceipt />
                </View>
              ) : null}
            </ScrollView>
          )}
        </View>
      </>
    );
  };

  const transformProductToItem = (order: OrderModel) => ({
    order_code: order.order_code,
    products: order.products,
    id: order.id.toString(),
    total: order.total,
    created_at: order.created_at,
    status: order.status,
  });

  const renderItem: React.FC<Props> = ({item}) => (
    <>
      <Pressable
        onPress={() => {
          dispatch(setActiveId(item?.id));
          screenWidth > 600 ? null : setModalVisible(true);
        }}
        key={item?.id}
        my={4}
        mx={4}
        borderRadius={10}
        borderTopColor={'gray.200'}
        bg={'white'}>
        <View my={4} flexDirection={'row'}>
          <Text mx={4} fontSize={'lg'} flex={2} color={'#848aac'} bold>
            {item?.order_code}
          </Text>
          <View justifyContent={'center'} alignItems={'center'} flex={1}>
            <Badge
              colorScheme="success"
              alignSelf="center"
              borderRadius={14}
              variant={'subtle'}>
              <Text bold color={'#2ebd53'}>
                {item?.status}
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
          <Button
            onPress={() => {
              dispatch(setActiveId(item?.id));
              screenWidth > 600 ? null : setModalVisible(true);
            }}
            mt={2}
            isLoading={loading}
            isLoadingText={'loading..'}
            mb={4}
            borderRadius={20}
            bg={primaryColor?.primaryColor}>
            <Text color={'white'} bold>
              Lihat Detail
            </Text>
          </Button>
        </View>
      </Pressable>
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
        px={5}
        py={5}
        paddingTop={30}>
        <View
          flexDirection={'row'}
          alignItems={'center'}
          justifyContent={'space-between'}>
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
        <View flexDirection={'row'}>
          <Button
            borderRadius={20}
            onPress={() => {
              navigation.navigate('LogoutScreen');
            }}
            alignSelf="center"
            bg={'#e85844'}>
            <Text fontSize={'md'} mx={2} bold color={'white'}>
              <MaterialIcons name="logout" color={'white'} />
              Logout
            </Text>
          </Button>
        </View>
      </View>

      <View mx={5}>
        <Input
          mt={4}
          bg={'white'}
          placeholder="Cari Pesanan"
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

      {loading ? (
        <>{renderSkeletonItems()}</>
      ) : (
        <>
          <View mx={6} my={4} flexDirection={'row'} minHeight={200}>
            <View
              pb={'40'}
              w={screenWidth > 600 ? '30%' : 'full'}
              alignItems={'center'}>
              {orderItems?.length > 0 ? (
                <FlatList
                  data={orderItems?.map(transformProductToItem)}
                  renderItem={renderItem}
                  keyExtractor={item => item?.id.toString()}
                  ListFooterComponent={renderFooter}
                  onRefresh={handleRefresh}
                  refreshing={false}
                  onEndReached={
                    orderItems?.length > 2 && emptyData === false
                      ? newFetchData
                      : null
                  }
                  onEndReachedThreshold={0}
                />
              ) : (
                <View mt={12} justifyContent={'center'} alignItems={'center'}>
                  <Text bold> Tidak Ada Data Ditemukan</Text>
                </View>
              )}
            </View>
            {screenWidth > 600 ? renderDetailItems() : null}
          </View>
        </>
      )}
      <Modal isOpen={modalVisible} onClose={setModalVisible} size={'full'}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Rincian</Modal.Header>
          <Modal.Body>{renderDetailItems()}</Modal.Body>
        </Modal.Content>
      </Modal>
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