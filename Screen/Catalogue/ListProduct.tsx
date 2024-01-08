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
import {useSelector} from 'react-redux';
import {RootState} from '../../Redux/store';
import {useTranslation} from 'react-i18next';

const ListProduct = () => {
  const {product, newFetchData, handleRefresh, searchProduct} =
    useProducts('catalogue');
  const {t} = useTranslation();
  const deviceInfo = useDeviceInfo();
  const navigation = useNavigation<NavigationProp<any>>();
  const {loading} = useLoading();
  const isLastPage = useSelector(
    (state: RootState) => state.buttonSlice.isLastPage,
  );
  const renderItem: ListRenderItem<ProductModel> = ({item, index}) => (
    <View flex={1} margin={5} key={`product-${item.id}-${index}`}>
      <Pressable
        disabled={item?.deleted_at !== null}
        onPress={() => {
          navigation.navigate('ProductDetail', {id: item?.id});
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
          ListFooterComponent={
            !isLastPage && product?.length > 4 ? <LoaderFooter /> : null
          }
          onRefresh={handleRefresh}
          refreshing={false}
          onEndReached={newFetchData}
          onEndReachedThreshold={10}
          mt={2}
        />
      ) : (
        <View mt={5}>
          <Empty
            title={t('empty-product')}
            showIMage={true}
            subtitle={t('all-product')}
          />
        </View>
      )}
    </View>
  );
};

export default ListProduct;
