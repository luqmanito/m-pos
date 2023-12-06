import {useEffect, useState} from 'react';
import {useLoading} from '../Context';
import {ProductModel} from '../models/ProductModel';
import productNetwork from '../Network/lib/product';
import {MetaModel} from '../models/MetaModel';

const useProducts = (screen: string) => {
  const [product, setProduct] = useState<ProductModel[]>([]);

  const [metaProduct, setMetaProduct] = useState<MetaModel>({
    current_page: 0,
    from: 0,
    per_page: 0,
    to: 0,
    total: 0,
    last_page: 0,
  });
  const {setLoading} = useLoading();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [chooseCategory, setChooseCategory] = useState(0);
  const [page, setPage] = useState(1);
  const numProducts = 10;
  const handleSearch = (newValue: string) => {
    return setSearchKeyword(newValue);
  };

  const handleCategory = (newValue: number) => {
    // if (newValue && newValue > 0) {
    setChooseCategory(newValue);
    // }
  };

  const searchProduct = (search: string) => {
    setSearchKeyword(search);
  };

  const handleRefresh = () => {
    fetchAllProducts();
  };

  const newFetchData = () => {
    setPage(prevPage => prevPage + 1); // Use a function to update state based on the previous state
  };

  useEffect(() => {
    // This effect will run after the state is updated
    if (page <= metaProduct.last_page) {
      handleNewFetchData(page);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    fetchAllProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchKeyword, chooseCategory]);

  const handleNewFetchData = async (value: number) => {
    try {
      let params: any = {
        ...paramProduct,
        page: value,
        per_page: numProducts,
        search: searchKeyword,
      };

      if (chooseCategory && chooseCategory > 0) {
        params = {
          ...params,
          categories: chooseCategory,
        };
      }

      if (screen === 'catalogue') {
        params = {
          ...params,
          withTrashed: true,
        };
      }

      const newData = await productNetwork.productList(params);
      if (newData.data.data.length > 0) {
        setProduct(prevProducts => [...prevProducts, ...newData.data.data]);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const paramProduct = {
    load: 'photos,category',
    sort: 'name|asc',
  };

  const fetchAllProducts = async (): Promise<ProductModel[] | void> => {
    setLoading(true);
    try {
      let params: any = {
        ...paramProduct,
        page: 1,
        per_page: numProducts,
        search: searchKeyword,
      };

      if (chooseCategory && chooseCategory > 0) {
        params = {
          ...params,
          categories: chooseCategory,
        };
      }
      if (screen === 'catalogue') {
        params = {
          ...params,
          withTrashed: true,
        };
      }
      const response = await productNetwork.productList(params);
      setMetaProduct(response.data.meta);
      setProduct(response.data.data);
    } catch (error) {
      console.error('Error fetching all products cache:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  return {
    product,
    handleSearch,
    fetchAllProducts,
    handleRefresh,
    handleCategory,
    newFetchData,
    searchProduct,
  };
};

export default useProducts;
