import {ScrollView, Text, View} from 'native-base';
import React, {FunctionComponent, useEffect, useState} from 'react';
import NavBar from '../../Components/Navbar/Navbar';
import productNetwork from '../../Network/lib/product';
import Product from '../../Components/Product/Product';
import {useSelector} from 'react-redux';
import {RootState} from '../../Redux/store';
import {ProductModel} from '../../models/ProductModel';

const ProductList: FunctionComponent = () => {
  const [products, setProducts] = useState<ProductModel[]>([]);
  const categoryState = useSelector((state: RootState) => state.productSlice);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await productNetwork.productCategoryList();
        if (categoryState?.categoryCode) {
          const productsFiltered = response.data.filter(
            product =>
              product?.category_id ===
              parseInt(categoryState?.categoryCode, 10),
          );
          setProducts(productsFiltered);
        } else {
          setProducts(response.data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchData();
  }, [categoryState?.categoryCode]);
  return (
    <>
      <NavBar msg={categoryState?.categoryName} />
      <View mx={4} my={4}>
        <Text fontSize={'lg'} color={'coolGray.700'}>
          Daftar Produk
        </Text>
        <Text fontSize={'sm'} color={'coolGray.500'}>
          {products.length} Produk
        </Text>
      </View>
      <ScrollView>
        {products.map(product => {
          return (
            <Product
              key={product?.id}
              name={product?.name}
              msg={product?.name}
              id={undefined}
              price={product?.price}
              photos={product.photos ? product?.photos[0]?.original_url : ''}
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
