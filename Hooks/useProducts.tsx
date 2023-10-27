import {useIsFocused, useRoute} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {screenWidth} from '../App';
import {useLoading} from '../Context';
import {ProductModel} from '../models/ProductModel';
import productNetwork from '../Network/lib/product';
import {
  setCashierVisited,
  setCatalogueVisited,
} from '../Redux/Reducers/isProductVisited';

import {RootState} from '../Redux/store';
// import {RootState} from '../Redux/store';
import cache from '../Util/cache';
import useNetworkInfo from './useNetworkInfo';

const useProducts = (screen: string) => {
  const [product, setProduct] = useState<ProductModel[]>([]);
  const [productOriginal, setOriginalProduct] = useState<ProductModel[]>([]);
  const [productCashier, setProductCashier] = useState<ProductModel[]>([]);
  const [originalProductCashier, setOriginalProductCashier] = useState<
    ProductModel[]
  >([]);
  const {setLoading} = useLoading();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [fetchData, setFetchData] = useState(false);
  const [chooseCategory, setChooseCategory] = useState(0);
  const [emptyData, setEmptyData] = useState(false);
  const [page, setPage] = useState(1);
  // const [counter, setCounter] = useState(0);
  const isFocused = useIsFocused();
  const route = useRoute();
  const isConnected = useNetworkInfo().isConnected;
  const marker = useSelector((state: RootState) => state.isProductVisited);
  // const allValuesAreTrue = Object.values(marker).every(value => value === true);
  // const productCashierRedux = useSelector(
  //   (state: RootState) => state.productListSlice.dataCashier,
  // );
  const numProducts = screenWidth > 600 ? 12 : 5;
  const dispatch = useDispatch();
  const handleSearch = (newValue: string) => {
    return setSearchKeyword(newValue);
  };

  const handleCategory = (newValue: number) => {
    return setChooseCategory(newValue);
  };
  function filterOfflineProductsByCategory(categoryId: number): void {
    if (categoryId === 0) {
      setProductCashier(originalProductCashier);
    } else {
      const filteredProduct = originalProductCashier.filter(
        item => item.category_id === categoryId,
      );
      return setProductCashier(filteredProduct);
    }
  }

  function searchOfflineProductsByName(searchTerm: string): void {
    if (searchTerm === '') {
      setProductCashier(originalProductCashier);
    } else {
      const lowercaseSearchTerm = searchTerm.toLowerCase(); // Convert search term to lowercase for case-insensitive search
      const productResult = originalProductCashier.filter(item =>
        item.name.toLowerCase().includes(lowercaseSearchTerm),
      );
      return setProductCashier(productResult);
    }
  }
  // function filterOfflineProductsCategory(categoryId: number): void {
  //   if (categoryId === 0) {
  //     setProduct(productOriginal);
  //   } else {
  //     const filteredProduct = productOriginal.filter(
  //       item => item.category_id === categoryId,
  //     );
  //     return setProduct(filteredProduct);
  //   }
  // }

  function searchOfflineProductsName(searchTerm: string): void {
    if (searchTerm === '') {
      setProduct(productOriginal);
    } else {
      const lowercaseSearchTerm = searchTerm.toLowerCase(); // Convert search term to lowercase for case-insensitive search
      const productResult = productOriginal?.filter(item =>
        item.name.toLowerCase().includes(lowercaseSearchTerm),
      );
      return setProduct(productResult);
    }
  }

  const handleRefresh = () => {
    setFetchData(prevToggle => !prevToggle);
  };
  // const resetCounter = () => {
  //   setCounter(0);
  // };

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

  const fetchAllProductsCache = async (
    value: string,
  ): Promise<ProductModel[] | void> => {
    setLoading(true);
    // setPage(1);
    try {
      const response = await productNetwork.productList({
        page: 1,
        per_page: 10000,
        search: searchKeyword,
        withTrashed: screen === 'cashier' ? false : true,
        categories: chooseCategory,
      });
      if (response && value === 'Catalogue') {
        dispatch(setCatalogueVisited(true));
        setProduct(response.data.data);
        setOriginalProduct(response.data.data);
        await cache.store('DataProductsCatalogue', response.data.data);
      }
      if (response && value === 'Cashier') {
        dispatch(setCashierVisited(true));
        setProductCashier(response.data.data);
        setOriginalProductCashier(response.data.data);
        await cache.store('DataProductsCashier', response.data.data);
      }
    } catch (error) {
      console.error('Error fetching all products cache:', error);
      throw error;
    } finally {
      setLoading(false);
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
    const fetchProductsCache = async (value: string): Promise<void> => {
      setLoading(false);
      if (value === 'Cashier') {
        const dataProductsCashier = await cache.get('DataProductsCashier');
        setOriginalProductCashier(dataProductsCashier);
        setProductCashier(dataProductsCashier);
      }
      if (value === 'Catalogue') {
        const dataProductsCatalogue = await cache.get('DataProductsCatalogue');
        setProduct(dataProductsCatalogue);
        setOriginalProduct(dataProductsCatalogue);
      }
    };
    const fetchEditProduct = async (): Promise<void> => {
      const dataProductsCashier = await cache.get('DataProductsCashier');
      setOriginalProductCashier(dataProductsCashier);
      setProductCashier(dataProductsCashier);
    };
    if (route?.name === 'EditOrderScreen') {
      fetchEditProduct();
    }
    if (isFocused && !isConnected && route?.name === 'Cashier') {
      fetchProductsCache('Cashier');
    }
    if (isFocused && !isConnected && route?.name === 'Catalogue') {
      fetchProductsCache('Catalogue');
    }
    if (
      route?.name === 'Catalogue' &&
      isConnected &&
      !marker.catalogueVisited
    ) {
      fetchAllProductsCache('Catalogue');
    }
    if (route?.name === 'Cashier' && isConnected && !marker.cashierVisited) {
      fetchAllProductsCache('Cashier');
    }
    if (
      isFocused &&
      route?.name === 'Cashier' &&
      isConnected &&
      marker?.cashierVisited
    ) {
      fetchProductsCache('Cashier');
    }
    if (
      isFocused &&
      route?.name === 'Catalogue' &&
      isConnected &&
      marker?.catalogueVisited
    ) {
      fetchProductsCache('Catalogue');
    }
    if (route?.name === 'ProductList') {
      fetchProductsCache('Catalogue');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // searchKeyword,
    isFocused,
    // screen,
    // product,
    fetchData,
    isConnected,
    numProducts,
    // setLoading,
    // productCashierRedux,
    chooseCategory,
  ]);
  return {
    filterOfflineProductsByCategory,
    product,
    handleSearch,
    productCashier,
    // resetCounter,
    searchOfflineProductsByName,
    fetchAllProductsCache,
    handleRefresh,
    handleCategory,
    newFetchData,
    emptyData,
    // filterOfflineProductsCategory,
    searchOfflineProductsName,
  };
};

export default useProducts;
