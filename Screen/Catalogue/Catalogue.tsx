import React, {useState, useCallback, useEffect, useContext} from 'react';
import {
  View,
  Button,
  Text,
  Input,
  Center,
  Image,
  ScrollView,
  Pressable,
  FlatList,
  HStack,
  Spinner,
  Heading,
  Skeleton,
} from 'native-base';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import shop from '../../Public/Assets/shop.png';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  useNavigation,
  NavigationProp,
  useFocusEffect,
} from '@react-navigation/native';
import _ from 'lodash';

import {
  clearStateProduct,
  setCategoryCode,
  setCategoryName,
  setProductId,
} from '../../Redux/Reducers/product';
import {useDispatch} from 'react-redux';
import {clearDataCamera} from '../../Redux/Reducers/upload';
import Product from '../../Components/Product/Product';
import {ProductModel} from '../../models/ProductModel';
import useProducts from '../../Hooks/useProducts';
import {PrimaryColorContext, useLoading} from '../../Context';
import useCategories from '../../Hooks/useCategory';
import {screenWidth} from '../../App';
import useNetworkInfo from '../../Hooks/useNetworkInfo';
import useScreenOrientation from '../../Hooks/useScreenOrientation';

interface Item {
  name: string;
  price: number;
  id: number;
  deleted_at?: boolean;
  photos: {
    original_url: string;
  }[];
}

interface Props {
  item: Item;
}
export const CatalogueScreen: React.FC = () => {
  const {
    product,
    fetchAllProductsCache,
    // handleSearch,
    newFetchData,
    handleRefresh,

    // filterOfflineProductsCategory,
    searchOfflineProductsName,
    emptyData,
  } = useProducts('Catalogue');

  function filterOfflineCategory(categoryId: number): number {
    const filteredProduct = product?.filter(
      item => item.category_id === categoryId,
    );
    return filteredProduct?.length === undefined ? 0 : filteredProduct?.length;
  }
  const primaryColor = useContext(PrimaryColorContext);
  const orientation = useScreenOrientation();
  const {categories, fetchCategories} = useCategories();
  const {loading} = useLoading();
  const dispatch = useDispatch();
  // dispatch(setMark({name: 'catalogueVisited', value: true}));
  const numProducts = screenWidth > 600 ? 11 : 4;
  const skeletonCount = 10;
  const [searchResults, setSearchResults] = useState('');
  const [activeTab, setActiveTab] = useState('Tab1');

  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
  };

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

  // const debouncedFetchProducts = _.debounce(handleSearch, 2000);
  const debouncedFetchProducts = _.debounce(searchOfflineProductsName, 500);
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

  const transformProductToItem = (products: ProductModel): Item => {
    return {
      name: products.name,
      price: products.price,
      deleted_at: products.deleted_at,
      id: products.id,
      photos: products.photos
        ? products.photos.map(photo => ({
            original_url: photo.original_url,
          }))
        : [],
    };
  };

  const renderItem: React.FC<Props> = ({item}) => (
    <>
      <Pressable
        disabled={item?.deleted_at === null ? false : true}
        onPress={() => {
          dispatch(setProductId(item?.id));
          navigation.navigate('ProductDetail');
        }}>
        <Product
          id={item?.id}
          name={item?.name}
          price={item?.price}
          basePrice={item?.price}
          photos={item.photos ? item?.photos[0]?.original_url : ''}
          toggle={true}
          onCashier={false}
          active={item?.deleted_at === null ? true : false}
        />
      </Pressable>
    </>
  );

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
            Katalog
          </Text>
          <View>
            <MaterialCommunityIcons
              name={isConnected ? 'wifi-check' : 'wifi-remove'}
              size={24}
              color="#fff"
              style={isConnected ? styles.wifi : styles.wifi_off}
            />
          </View>
          <View ml={4}>
            <Button
              isLoading={loading}
              isLoadingText="Loading"
              onPress={() => {
                fetchCategories();
                fetchAllProductsCache('Catalogue');
              }}
              isDisabled={isConnected ? false : true}
              bg={primaryColor?.primaryColor}
              leftIcon={
                <MaterialCommunityIcons
                  name={'download'}
                  size={24}
                  color="#fff"
                  style={styles.download}
                />
              }>
              Download Produk
            </Button>
          </View>
        </View>

        <View flexDirection={'row'}>
          <MaterialCommunityIcons
            name="sort-alphabetical-variant"
            size={24}
            color={primaryColor?.primaryColor}
            style={styles.icon}
          />

          <FontAwesome
            onPress={() => navigation.navigate('PrinterScreen')}
            name="filter"
            size={24}
            color={primaryColor?.primaryColor}
            style={styles.icon}
          />
        </View>
      </View>
      <View mx={5}>
        <Input
          mt={4}
          bg={'white'}
          isDisabled={activeTab === 'Tab2'}
          placeholder="Cari Produk"
          placeholderTextColor={'#888888'}
          variant="filled"
          value={searchResults}
          onChangeText={text => {
            setSearchResults(text);
            // searchOfflineProductsName(text);
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
      <View mx={6} mt={4} mb={4} flexDirection={'row'}>
        <Pressable
          p={2}
          bg={activeTab === 'Tab1' ? primaryColor?.secondaryColor : null}
          w={'50%'}
          onPress={() => handleTabPress('Tab1')}
          borderRadius={20}>
          <Text
            textAlign={'center'}
            bold
            color={primaryColor?.primaryColor}
            borderRadius={20}>
            Produk
          </Text>
        </Pressable>
        <Pressable
          p={2}
          onPress={() => handleTabPress('Tab2')}
          bg={activeTab === 'Tab2' ? primaryColor?.secondaryColor : null}
          w={'50%'}
          borderRadius={20}>
          <Text
            textAlign={'center'}
            bold
            color={primaryColor?.primaryColor}
            borderRadius={20}>
            Etalase
          </Text>
        </Pressable>
      </View>
      {loading ? (
        <>{renderSkeletonItems()}</>
      ) : activeTab === 'Tab1' ? (
        <View
          flex={1}
          justifyContent={screenWidth > 600 ? 'center' : null}
          alignItems={screenWidth > 600 ? 'center' : null}
          mb={10}>
          {product?.length > 0 ? (
            <FlatList
              key={numOfColumns()}
              data={product.map(transformProductToItem)}
              renderItem={renderItem}
              keyExtractor={item => item?.id.toString()}
              numColumns={numOfColumns()}
              ListFooterComponent={renderFooter}
              onRefresh={handleRefresh}
              refreshing={false}
              onEndReached={
                product.length > numProducts && emptyData === false
                  ? newFetchData
                  : null
              }
              onEndReachedThreshold={0}
            />
          ) : product?.length === 0 && searchResults ? (
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
      ) : activeTab === 'Tab2' ? (
        <ScrollView>
          {categories?.length > 0 ? (
            <>
              <Pressable
                onPress={() => {
                  navigation.navigate('ProductList');
                  dispatch(setCategoryName('Semua Produk'));
                }}>
                <View mx={4} my={4}>
                  <Text fontSize={'lg'} color={'coolGray.700'}>
                    Semua Produk
                  </Text>
                  <Text fontSize={'sm'} color={'coolGray.500'}>
                    {`${product?.length > 0 ? product?.length : 0} Produk`}
                  </Text>
                </View>
                <View bg={'coolGray.300'} h={0.5} mx={4} />
              </Pressable>
              {categories?.map(item => {
                return (
                  <React.Fragment key={item?.id}>
                    <Pressable
                      onPress={() => {
                        navigation.navigate('ProductList');
                        dispatch(setCategoryCode(item?.id));
                        dispatch(setCategoryName(item?.name));
                      }}>
                      <View mx={4} my={4}>
                        <Text fontSize={'lg'}>{item?.name}</Text>
                        <Text fontSize={'sm'} color={'coolGray.500'}>
                          {`${filterOfflineCategory(item?.id)} Produk`}
                        </Text>
                      </View>
                      <View bg={'coolGray.300'} h={0.5} mx={4} />
                    </Pressable>
                  </React.Fragment>
                );
              })}
            </>
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
        </ScrollView>
      ) : (
        <>
          <Text>Kosong</Text>
        </>
      )}

      <Button
        borderRadius={34}
        isLoading={loading}
        onPress={() =>
          navigation.navigate(
            activeTab === 'Tab1' ? 'AddProductScreen' : 'AddCategoryScreen',
          )
        }
        w={'45%'}
        position={'absolute'}
        alignSelf="center"
        bottom={18}
        bg={primaryColor?.primaryColor}>
        <Text fontSize={'md'} color="white">
          <MaterialIcons name="add-circle" size={15} color="white" />{' '}
          {activeTab === 'Tab1' ? 'Tambah Produk' : 'Tambah Kategori'}
        </Text>
      </Button>
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
  download: {
    // marginLeft: 10,
    color: '#2dbf52',
  },
};
