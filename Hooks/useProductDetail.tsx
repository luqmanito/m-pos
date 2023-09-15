import {useToast} from 'native-base';
import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {formatPrice} from '../Components/Rupiah/RupiahFormatter';
import ToastAlert from '../Components/Toast/Toast';
import {useLoading} from '../Context';
import {ProductModel} from '../models/ProductModel';
import {ValidationErrorModel} from '../models/ValidationErrorModel';
import productNetwork from '../Network/lib/product';
import {setCategoryCode, setCategoryName} from '../Redux/Reducers/product';
import {RootState} from '../Redux/store';
import cache from '../Util/cache';
import useNetworkInfo from './useNetworkInfo';

const useProductDetail = () => {
  const toast = useToast();
  const productID = useSelector(
    (state: RootState) => state.productSlice?.productId,
  );
  const isConnected = useNetworkInfo().isConnected;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [price, setPrice] = useState<number | null>(null);
  const [imageId, setImageId] = useState(0);
  const [photos, setPhotos] = useState('');

  const {setLoading} = useLoading();
  const dispatch = useDispatch();

  const resetphotos = () => {
    return setPhotos('');
  };
  const handleNameChange = (text: string) => {
    return setName(text);
  };
  const handlePriceChange = (number: string) => setPrice(formatPrice(number));
  const handleCodeChange = (text: string) => setCode(text);
  const handleDescriptionChange = (text: string) => {
    return setDescription(text);
  };

  useEffect(() => {
    setLoading(true);
    const fetchData = async (): Promise<ProductModel | void> => {
      try {
        const data = await productNetwork.productDetail({id: productID});
        if (data) {
          await cache.store(`DataProductId=${productID}`, data);
          setLoading(false);
          setName(data?.data?.name);
          setDescription(data?.data?.description);
          setCode(data?.data?.code);
          setPrice(data?.data?.price);
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
      } catch (error: ValidationErrorModel | any) {
        setLoading(false);
        if (error as ValidationErrorModel) {
          console.log(error.message);
        }
        console.error('Error fetching products:', error);
      }
    };
    const fetchDataDetailCache = async (): Promise<void> => {
      setLoading(true);
      const data = await cache.get(`DataProductId=${productID}`);
      if (!data) {
        setLoading(false);
        ToastAlert(
          toast,
          'error',
          'Data belum tersedia, kunjungi kembali halaman ini sekali saat perangkat sudah Online',
        );
      } else {
        setLoading(false);
        setName(data?.data?.name);
        setDescription(data?.data?.description);
        setCode(data?.data?.code);
        setPrice(data?.data?.price);
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
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productID, isConnected, dispatch, setLoading]);

  return {
    name,
    code,
    handlePriceChange,
    handleNameChange,
    handleDescriptionChange,
    description,
    price,
    imageId,
    photos,
    resetphotos,
    handleCodeChange,
  };
};

export default useProductDetail;
