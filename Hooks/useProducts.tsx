import {useIsFocused} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {screenWidth} from '../App';
import {useLoading} from '../Context';
import {ProductModel} from '../models/ProductModel';
import productNetwork from '../Network/lib/product';
import cache from '../Util/cache';
import useNetworkInfo from './useNetworkInfo';

const useProducts = (screen: string) => {
  const [product, setProduct] = useState<ProductModel[]>([]);
  const [productCashier, setProductCashier] = useState<ProductModel[]>([]);
  const {setLoading} = useLoading();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [fetchData, setFetchData] = useState(false);
  const [chooseCategory, setChooseCategory] = useState(0);
  const [emptyData, setEmptyData] = useState(false);
  const [page, setPage] = useState(1);
  const isFocused = useIsFocused();
  const isConnected = useNetworkInfo().isConnected;
  const numProducts = screenWidth > 600 ? 12 : 5;

  const handleSearch = (newValue: string) => {
    return setSearchKeyword(newValue);
  };

  const handleCategory = (newValue: number) => {
    return setChooseCategory(newValue);
  };

  const handleRefresh = () => {
    setFetchData(prevToggle => !prevToggle);
  };

  const newFetchData = () => {
    setPage(prevPage => prevPage + 1);
    const pages = page + 1;
    handleNewFetchData(pages);
  };

  const handleNewFetchData = async (value: number) => {
    try {
      const newData = await productNetwork.productList({
        page: value,
        per_page: numProducts,
        search: searchKeyword,
        withTrashed: screen === 'cashier' ? false : true,
      });

      if (newData) {
        setProduct([...product, ...newData?.data.data]);
        if (newData?.data?.data?.length === 0) {
          setEmptyData(true);
          setProduct([...product, ...newData?.data.data]);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAllProductsCache = async (): Promise<ProductModel[] | void> => {
    setPage(1);
    try {
      const response = await productNetwork.productList({
        page: 1,
        per_page: 10000,
        search: searchKeyword,
        // withTrashed: screen === 'cashier' ? false : true,
        withTrashed: true,
        categories: chooseCategory,
      });
      if (response) {
        await cache.store('DataProductsCatalogue', response.data.data);
      }
    } catch (error) {
      console.error('Error fetching all products cache:', error);
      throw error;
    }
    try {
      const response = await productNetwork.productList({
        page: 1,
        per_page: 10000,
        search: searchKeyword,
        // withTrashed: screen === 'cashier' ? false : true,
        withTrashed: false,
        categories: chooseCategory,
      });
      if (response) {
        await cache.store('DataProductsCashier', response.data.data);
      }
    } catch (error) {
      console.error('Error fetching all products cache:', error);
      throw error;
    }
  };
  useEffect(() => {
    // const fetchProducts = async (): Promise<ProductModel[] | void> => {
    //   setLoading(true);
    //   setPage(1);
    //   try {
    //     const response = await productNetwork.productList({
    //       page: 1,
    //       per_page: numProducts,
    //       search: searchKeyword,
    //       withTrashed: screen === 'cashier' ? false : true,
    //       categories: chooseCategory,
    //     });
    //     if (response) {
    //       setEmptyData(false);
    //       setLoading(false);

    //       return setProduct(response.data.data);
    //     }
    //   } catch (error) {
    //     setLoading(false);
    //     console.error('Error fetching products:', error);
    //     throw error;
    //   }
    // };
    const fetchProductsCache = async (): Promise<void> => {
      setLoading(true);
      const dataProductsCatalogue = await cache.get('DataProductsCatalogue');
      const dataProductsCashier = await cache.get('DataProductsCashier');
      setLoading(false);
      setProduct(dataProductsCatalogue);
      setProductCashier(dataProductsCashier);
    };
    // if (isFocused && !isConnected) {
    fetchProductsCache();
    // }
    // if (isFocused && isConnected) {
    //   fetchProducts();
    // }
  }, [
    searchKeyword,
    isFocused,
    screen,
    fetchData,
    isConnected,
    numProducts,
    setLoading,
    chooseCategory,
  ]);
  return {
    product,
    handleSearch,
    productCashier,
    fetchAllProductsCache,
    handleRefresh,
    handleCategory,
    newFetchData,
    emptyData,
  };
};

export default useProducts;
