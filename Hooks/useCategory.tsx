import {useIsFocused} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {useLoading} from '../Context';
import {CategoryModel} from '../models/CategoryModel';
import productNetwork from '../Network/lib/product';
import cache from '../Util/cache';
import useNetworkInfo from './useNetworkInfo';

const useCategories = () => {
  const isFocused = useIsFocused();
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const {setLoading} = useLoading();
  const isConnected = useNetworkInfo().isConnected;

  const fetchCategories = async (): Promise<CategoryModel[] | void> => {
    setLoading(true);
    try {
      const response = await productNetwork.categoryList({
        page: 1,
      });
      if (response) {
        await cache.store('DataCategory', response.data.data);
        setLoading(false);
        // return setCategories(response.data.data);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error fetching products:', error);
      throw error;
    }
  };
  useEffect(() => {
    const fetchCategoriesCache = async (): Promise<void> => {
      setLoading(true);
      const dataUser = await cache.get('DataCategory');
      setLoading(false);
      setCategories(dataUser);
    };
    // if (isFocused && !isConnected) {
    fetchCategoriesCache();
    // }
    // if (isFocused && isConnected) {
    //   fetchCategories();
    // }
  }, [isConnected, setLoading]);
  return {categories, fetchCategories};
};

export default useCategories;
