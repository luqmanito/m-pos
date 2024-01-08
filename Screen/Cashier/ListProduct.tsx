import React, {useEffect, useState} from 'react';

import {View, FlatList, Center} from 'native-base';
import useProducts from '../../Hooks/useProducts';
import Product from '../../Components/Product/Product';
import {ListRenderItem} from 'react-native';
import {ProductModel} from '../../models/ProductModel';
import useDeviceInfo from '../../Hooks/useDeviceInfo';
import LoaderFooter from '../../Components/Footer/LoaderFooter';
import Empty from '../../Components/Content/Empty';
import SkeletonLoader from '../../Components/Skeleton/SkeletonLoader';
import {useLoading} from '../../Context';
import Search from '../../Components/Form/Search';
import CategoryForm from './components/CategoryForm';
import {RootState} from '../../Redux/store';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import ContainerNav from '../../Components/Layout/ContainerNav';

interface ChildProps {
  updateParentState: (newValue: boolean) => void;
  selectedCategories: number;
}

const ProductList: React.FC<ChildProps> = ({
  updateParentState,
  selectedCategories,
}) => {
  const {t} = useTranslation();
  const {loading} = useLoading();
  const [searchResults, setSearchResults] = useState('');
  const categoryName = useSelector(
    (state: RootState) => state.productSlice?.categoryName,
  );
  const {product, newFetchData, handleRefresh, searchProduct, handleCategory} =
    useProducts('cashier');
  const deviceInfo = useDeviceInfo();
  const renderItem: ListRenderItem<ProductModel> = ({item}) => (
    <View flex={1} margin={5}>
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
    </View>
  );

  function numOfColumns() {
    if (deviceInfo.isTablet) {
      return 2;
    } else {
      return 1;
    }
  }

  const handleChange = (newValue: boolean) => {
    updateParentState(newValue);
  };

  const isLastPage = useSelector(
    (state: RootState) => state.buttonSlice.isLastPage,
  );

  useEffect(() => {
    handleCategory(selectedCategories);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategories]);

  return (
    <>
      <View mx={2} my={2} flexDirection={'row'}>
        <Center px={2} w={'50%'} borderRadius={20}>
          <Search
            search={text => {
              searchProduct(text);
              setSearchResults(text);
            }}
          />
        </Center>
        <Center px={2} w={'50%'} borderRadius={20}>
          <CategoryForm
            onPress={() => handleChange(true)}
            placeholder={t('set-category')}
            value={categoryName}
          />
        </Center>
      </View>
      <View flex={1} mb={10}>
        {loading ? (
          <SkeletonLoader skeletonCount={10} />
        ) : product?.length > 0 ? (
          <FlatList
            key={'product-list-cashier'}
            data={product}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            numColumns={numOfColumns()}
            ListFooterComponent={
              !isLastPage && product?.length > 4 ? <LoaderFooter /> : null
            }
            onRefresh={handleRefresh}
            refreshing={false}
            onEndReached={newFetchData}
            onEndReachedThreshold={0.5}
          />
        ) : product?.length === 0 && searchResults ? (
          <Empty title={t('no-data-found')} showIMage={false} />
        ) : (
          <ContainerNav>
            <View mt={16}>
              <Empty
                title={t('empty-product')}
                showIMage={true}
                subtitle={t('all-product')}
              />
            </View>
          </ContainerNav>
        )}
      </View>
    </>
  );
};

export default ProductList;
