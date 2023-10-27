import {useIsFocused} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {useLoading} from '../Context';
import {CategoryModel} from '../models/CategoryModel';
import productNetwork from '../Network/lib/product';
import cache from '../Util/cache';
import useNetworkInfo from './useNetworkInfo';

const useCategories = () => {
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const {setLoading} = useLoading();
  const isConnected = useNetworkInfo().isConnected;
  const [counter, setCounter] = useState(0);
  const isFocused = useIsFocused();
  const fetchCategories = async (): Promise<CategoryModel[] | void> => {
    setLoading(true);
    try {
      const response = await productNetwork.categoryList({
        page: 1,
      });
      if (response) {
        await cache.store('DataCategory', response.data.data);
        return setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchCategoriesCache = async (): Promise<void> => {
      // setLoading(true);
      const dataCategories = await cache.get('DataCategory');
      setLoading(false);
      setCategories(dataCategories);
    };
    if (isFocused && !isConnected) {
      fetchCategoriesCache();
    }
    if (isFocused && isConnected && counter === 0) {
      fetchCategories();
      setCounter(counter + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, setLoading]);
  return {categories, fetchCategories};
};

export default useCategories;
