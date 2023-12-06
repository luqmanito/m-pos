import {useToast} from 'native-base';
import {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import ToastAlert from '../Components/Toast/Toast';
import {useLoading} from '../Context';
import {ProductModel} from '../models/ProductModel';
import {ValidationErrorModel} from '../models/ValidationErrorModel';
import productNetwork from '../Network/lib/product';
import {
  setCategoryCode,
  setCategoryName,
  setDetailImageId,
} from '../Redux/Reducers/product';
import cache from '../Util/cache';
import useNetworkInfo from './useNetworkInfo';

const useProductDetail = (id: number | null) => {
  const toast = useToast();
  const isConnected = useNetworkInfo().isConnected;

  const [form, setForm] = useState({
    name: '',
    code: '',
    price: 0,
    description: '',
  });
  const [imageId, setImageId] = useState(0);
  const [photos, setPhotos] = useState('');
  const {setLoading} = useLoading();
  const dispatch = useDispatch();

  const resetphotos = () => {
    return setPhotos('');
  };

  const handleForm = (key: string, data: string | number | null): void => {
    setForm(prev => ({
      ...prev,
      [key]: data,
    }));
  };

  useEffect(() => {
    setLoading(true);
    const fetchData = async (): Promise<ProductModel | void> => {
      try {
        const data = await productNetwork.productDetail({id: id});
        if (data) {
          await cache.store(`DataProductId=${id}`, data);
          setLoading(true);
          handleForm('name', data?.data?.name);
          handleForm('code', data?.data?.code);
          handleForm('price', data?.data?.price);
          handleForm('description', data?.data?.description);
          dispatch(setCategoryName(data?.data?.category?.name));
          dispatch(setCategoryCode(data?.data?.category_id.toString()));
          if (data?.data?.photos) {
            if (data?.data?.photos.length > 0) {
              dispatch(setDetailImageId(data?.data?.photos[0]?.id));
              const imageUrl = data?.data?.photos[0]?.original_url;
              setPhotos(imageUrl);
            }
          }
        }
      } catch (error: ValidationErrorModel | any) {
        setLoading(false);
        if (error as ValidationErrorModel) {
          console.log(error.message);
        }
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    const fetchDataDetailCache = async (): Promise<void> => {
      setLoading(true);
      const data = await cache.get(`DataProductId=${id}`);
      if (!data) {
        setLoading(true);
        ToastAlert(
          toast,
          'error',
          'Data belum tersedia, kunjungi kembali halaman ini sekali saat perangkat sudah Online',
        );
      } else {
        setLoading(true);
        handleForm('name', data?.data?.name);
        handleForm('code', data?.data?.code);
        handleForm('price', data?.data?.price);
        handleForm('description', data?.data?.description);
        dispatch(setCategoryName(data?.data?.category?.name));
        dispatch(setCategoryCode(data?.data?.category_id.toString()));
        if (data?.data?.photos) {
          if (data?.data?.photos.length > 0) {
            setImageId(data?.data?.photos[0]?.id);
            const imageUrl = data?.data?.photos[0]?.original_url;
            setPhotos(imageUrl);
          }
        }
      }
    };
    if (!isConnected) {
      fetchDataDetailCache();
    } else {
      id === undefined || id === null ? null : fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isConnected, dispatch, setLoading]);

  return {
    handleForm,
    imageId,
    form,
    photos,
    resetphotos,
  };
};

export default useProductDetail;
