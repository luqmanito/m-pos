import {ScrollView, Text, View} from 'native-base';
import React, {FunctionComponent, useEffect, useState} from 'react';
import NavBar from '../../Components/Navbar/Navbar';
import Product from '../../Components/Product/Product';
import {useSelector} from 'react-redux';
import {RootState} from '../../Redux/store';
import {ProductModel} from '../../models/ProductModel';
import useProducts from '../../Hooks/useProducts';
import {useTranslation} from 'react-i18next';

const ProductList: FunctionComponent = () => {
  const [products, setProducts] = useState<ProductModel[]>([]);
  const categoryState = useSelector((state: RootState) => state.productSlice);
  const {t} = useTranslation();
  const {product} = useProducts('catalogue');

  useEffect(() => {
    const fetchData = () => {
      try {
        if (categoryState?.categoryCode) {
          const productsFiltered = product.filter(
            item =>
              item?.category_id === parseInt(categoryState?.categoryCode, 10),
          );
          setProducts(productsFiltered);
        } else {
          setProducts(product);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchData();
  }, [categoryState?.categoryCode, product]);
  return (
    <>
      <NavBar msg={categoryState?.categoryName} />
      <View mx={4} my={4}>
        <Text fontSize={'lg'} color={'coolGray.700'}>
          {t('list-product')}
        </Text>
        <Text fontSize={'sm'} color={'coolGray.500'}>
          {products?.length} {t('product')}
        </Text>
      </View>
      <ScrollView mb={4}>
        {products?.map(item => {
          return (
            <Product
              key={item?.id}
              name={item?.name}
              msg={item?.name}
              id={undefined}
              price={item?.price}
              photos={item.photos ? item?.photos[0]?.original_url : ''}
              toggle={false}
              basePrice={undefined}
              onCashier={false}
            />
          );
        })}
      </ScrollView>
    </>
  );
};

export default ProductList;
