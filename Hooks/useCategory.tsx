import {useEffect, useState} from 'react';
import {useLoading} from '../Context';
import {CategoryModel} from '../models/CategoryModel';
import categoryNetwork from '../Network/lib/categories';
import {MetaModel} from '../models/MetaModel';
import {useIsFocused} from '@react-navigation/native';

const useCategories = () => {
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const {setLoading} = useLoading();
  const [metaProduct, setMetaProduct] = useState<MetaModel>({
    current_page: 0,
    from: 0,
    per_page: 0,
    to: 0,
    total: 0,
    last_page: 0,
  });
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [searchKeyword, setSearchKeyword] = useState('');

  const searchCategory = (search: string) => {
    setSearchKeyword(() => search);
  };

  const handleRefresh = () => {
    fetchCategories();
  };
  const isFocused = useIsFocused();
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
    if (isFocused) {
      fetchCategories();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchKeyword, isFocused]);

  const handleNewFetchData = async (page: number) => {
    try {
      const response = await categoryNetwork.list({
        page: page,
        sort: 'name|asc',
        per_page: perPage,
        search: searchKeyword,
      });
      if (response.data.data.length > 0) {
        setMetaProduct(response.data.meta);
        setCategories(prevState => [...prevState, ...response.data.data]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async (): Promise<CategoryModel[] | void> => {
    setLoading(true);
    try {
      const response = await categoryNetwork.list({
        page: 1,
        sort: 'name|asc',
        per_page: perPage,
        search: searchKeyword,
      });
      if (response) {
        setMetaProduct(response.data.meta);
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  return {
    categories,
    fetchCategories,
    handleRefresh,
    newFetchData,
    searchCategory,
  };
};

export default useCategories;
