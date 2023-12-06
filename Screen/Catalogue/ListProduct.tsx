import useProducts from '../../Hooks/useProducts';
import {FlatList, Pressable, View} from 'native-base';
import LoaderFooter from '../../Components/Footer/LoaderFooter';
import Empty from '../../Components/Content/Empty';
import React from 'react';
import {ListRenderItem} from 'react-native';
import {ProductModel} from '../../models/ProductModel';
import useDeviceInfo from '../../Hooks/useDeviceInfo';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {useLoading} from '../../Context';
import SkeletonLoader from '../../Components/Skeleton/SkeletonLoader';
import Product from './components/Product';
import Search from '../../Components/Form/Search';

const ListProduct = () => {
  const {product, newFetchData, handleRefresh, searchProduct} =
    useProducts('catalogue');
  const deviceInfo = useDeviceInfo();
  const navigation = useNavigation<NavigationProp<any>>();
  const {loading} = useLoading();

  const renderItem: ListRenderItem<ProductModel> = ({item, index}) => (
    <View
      flex={1}
      mr={index % 2 === 0 ? 10 : null}
      my={2}
      key={`product-${item.id}-${index}`}>
      <Pressable
        disabled={item?.deleted_at !== null}
        onPress={() => {
          // dispatch(setProductId(item?.id));
          navigation.navigate('ProductDetail', {productId: item?.id});
        }}>
        <Product product={item} />
      </Pressable>
    </View>
  );

  function numOfColumns() {
    if (deviceInfo.isTablet) {
      return 2;
    } else {
      return 1;
    }
  }

  return (
    <View paddingBottom={5}>
      <View>
        <Search
          search={text => {
            searchProduct(text);
          }}
        />
      </View>
      {loading ? (
        <SkeletonLoader skeletonCount={10} />
      ) : product?.length > 0 ? (
        <FlatList
          key={'product-list'}
          data={product}
          renderItem={renderItem}
          keyExtractor={item => item?.id.toString()}
          numColumns={numOfColumns()}
          ListFooterComponent={<LoaderFooter />}
          onRefresh={handleRefresh}
          refreshing={false}
          onEndReached={newFetchData}
          onEndReachedThreshold={10}
          mt={2}
        />
      ) : (
        <Empty
          title={'Yuk, Tambah Produk Jualanmu'}
          showIMage={true}
          subtitle={'Semua produk yang kamu jual bisa diatur dari sini'}
        />
      )}
    </View>
  );
};

export default ListProduct;
