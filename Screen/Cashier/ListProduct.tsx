import React, {useEffect, useState} from 'react';

import {View, FlatList, Text, Center} from 'native-base'; // Import your components
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

interface ChildProps {
  updateParentState: (newValue: boolean) => void;
  selectedCategories: number;
}

const ProductList: React.FC<ChildProps> = ({
  updateParentState,
  selectedCategories,
}) => {
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
            placeholder="Pilih Kategori"
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
            ListFooterComponent={<LoaderFooter />}
            onRefresh={handleRefresh}
            refreshing={false}
            onEndReached={newFetchData}
            onEndReachedThreshold={10}
          />
        ) : product?.length === 0 && searchResults ? (
          <View mt={12} justifyContent={'center'} alignItems={'center'}>
            <Text bold> Tidak Ada Data Ditemukan</Text>
          </View>
        ) : (
          <Empty
            title={'Yuk, Tambah Produk Jualanmu'}
            showIMage={true}
            subtitle={'Semua produk yang kamu jual bisa diatur dari sini'}
          />
        )}
      </View>
    </>
  );
};

export default ProductList;
