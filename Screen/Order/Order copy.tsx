import React, {useState, useCallback, useEffect, useContext} from 'react';
import {
  View,
  Button,
  Text,
  Input,
  Center,
  Image,
  ScrollView,
  Divider,
  HStack,
  Badge,
  FlatList,
  Pressable,
} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import shop from '../../Public/Assets/shop.png';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  useNavigation,
  NavigationProp,
  useFocusEffect,
} from '@react-navigation/native';
import _ from 'lodash';
import {StyleSheet} from 'react-native';
import {clearStateProduct} from '../../Redux/Reducers/product';
import {useDispatch} from 'react-redux';
import {clearDataCamera} from '../../Redux/Reducers/upload';
import noImage from '../../Public/Assets/no-Image.jpg';
import RupiahFormatter from '../../Components/Rupiah/Rupiah';
import formatDate from '../../Components/Date/Date';
import {setActiveId} from '../../Redux/Reducers/button';
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
}

interface Props {
  item: Item;
}

export const OrderScreen: React.FC = () => {
  const skeletonItems = RenderSkeletonItems(screenWidth);
  const {loading} = useLoading();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('Tab1');
  const [searchResults, setSearchResults] = useState('');
  const [activeMethod, setActiveMethod] = useState('method1');
  const {orders, handleSearch, newFetchData, handleRefresh, emptyData} =
    useOrders();
  const {submitPayment} = usePaymentSubmit();
  const debouncedFetchProducts = _.debounce(handleSearch, 300);
  const {cacheDataSubmissions} = useDataSubmission();
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
                Selesai
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
            onPress={() => {
              navigation.navigate('OrderDetailScreen');
              dispatch(setActiveId(item?.id));
            }}
            mt={2}
            mb={4}
            borderRadius={20}
            bg={primaryColor?.primaryColor}>
            <Text color={'white'} bold>
              Lihat Detail
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
        <Pressable
          p={2}
          bg={activeTab === 'Tab1' ? primaryColor?.secondaryColor : null}
          w={'50%'}
          borderRadius={20}
          onPress={() => setActiveTab('Tab1')}>
          <Text
            textAlign={'center'}
            bold
            color={primaryColor?.primaryColor}
            borderRadius={20}>
            Online
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setActiveTab('Tab2')}
          p={2}
          bg={activeTab === 'Tab2' ? primaryColor?.secondaryColor : null}
          w={'50%'}
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
          <View borderBottomWidth={0.2} my={4} flexDirection={'row'}>
            <Button
              bg={'transparent'}
              _text={
                activeMethod === 'method1'
                  ? {
                      color: primaryColor?.primaryColor,
                    }
                  : {
                      color: '#1F2937',
                    }
              }
              onPress={() => setActiveMethod('method1')}
              variant="unstyled"
              borderBottomColor={
                activeMethod === 'method1' ? primaryColor?.primaryColor : null
              }
              borderBottomWidth={activeMethod === 'method1' ? 2 : 0}
              textAlign={'center'}
              flex={1}>
              Pesanan Tersimpan
            </Button>

            <Button
              bg={'transparent'}
              _text={
                activeMethod === 'method3'
                  ? {
                      color: primaryColor?.primaryColor,
                    }
                  : {
                      color: '#1F2937',
                    }
              }
              onPress={() => setActiveMethod('method3')}
              variant="unstyled"
              borderBottomColor={
                activeMethod === 'method3' ? primaryColor?.primaryColor : null
              }
              borderBottomWidth={activeMethod === 'method3' ? 2 : 0}
              textAlign={'center'}
              flex={1}>
              Selesai
            </Button>
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
        <ScrollView>
          {cacheDataSubmissions && cacheDataSubmissions?.length !== 0 ? (
            cacheDataSubmissions.map((item, index) => {
              return (
                <React.Fragment key={index}>
                  <View mx={4}>
                    <View>
                      <View
                        mt={4}
                        mx={4}
                        borderRadius={14}
                        borderTopColor={'gray.200'}
                        bg={'white'}>
                        <View my={4} flexDirection={'row'}>
                          <Text
                            mx={4}
                            fontSize={'lg'}
                            flex={2}
                            color={'black'}
                            bold>
                            {`No Transaksi Sementara : ${item?.invoiceNumber}`}
                          </Text>
                        </View>
                        <Divider />
                        <View mx={4} mt={4} bg="white">
                          <View
                            mx={4}
                            flexDirection={'row'}
                            justifyContent={'space-between'}>
                            <View alignSelf={'flex-start'}>
                              <Text mt={3}>Status</Text>
                            </View>
                            <View alignSelf={'flex-end'} mt={3}>
                              <Text bold color={'black'}>
                                Pending
                              </Text>
                            </View>
                          </View>
                          <View
                            mx={4}
                            flexDirection={'row'}
                            justifyContent={'space-between'}>
                            <View alignSelf={'flex-start'}>
                              <Text mt={3}>Metode Pembayaran</Text>
                            </View>
                            <View alignSelf={'flex-end'} mt={3}>
                              <Text bold color={'black'}>
                                {item?.payment_method === 1
                                  ? 'Tunai'
                                  : 'Non Tunai'}
                              </Text>
                            </View>
                          </View>
                          <View
                            mx={4}
                            flexDirection={'row'}
                            justifyContent={'space-between'}>
                            <View alignSelf={'flex-start'}>
                              <Text mt={3}>Waktu Pembayaran</Text>
                            </View>
                            <View alignSelf={'flex-end'} mt={3}>
                              <Text bold color={'black'}>
                                {item?.date}
                              </Text>
                            </View>
                          </View>
                          <View
                            mx={4}
                            flexDirection={'row'}
                            justifyContent={'space-between'}>
                            <View alignSelf={'flex-start'}>
                              <Text mt={3}>Total Belanja</Text>
                            </View>
                            <View alignSelf={'flex-end'} mt={3}>
                              <Text bold>
                                {RupiahFormatter(item?.total_price)}
                              </Text>
                            </View>
                          </View>
                          {item?.table_no ? (
                            <View
                              mx={4}
                              flexDirection={'row'}
                              justifyContent={'space-between'}>
                              <View alignSelf={'flex-start'}>
                                <Text mt={3}>Keterangan Meja</Text>
                              </View>
                              <View alignSelf={'flex-end'} mt={3}>
                                <Text bold>
                                  as
                                  {item?.table_no}
                                </Text>
                              </View>
                            </View>
                          ) : null}
                          <View
                            mx={4}
                            flexDirection={'row'}
                            justifyContent={'space-between'}>
                            <View alignSelf={'flex-start'}>
                              <Text mt={3}>Nama Kasir</Text>
                            </View>
                            <View alignSelf={'flex-end'} mt={3}>
                              <Text mb={4} bold>
                                {item?.cashierName}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </React.Fragment>
              );
            })
          ) : (
            <>
              <View mt={4}>
                <Text mt={4} bold fontSize={'3xl'} textAlign={'center'}>
                  Belum ada data transaksi baru
                </Text>
              </View>
            </>
          )}
        </ScrollView>
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
