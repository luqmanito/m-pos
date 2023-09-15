import axios from 'axios';
import {useState} from 'react';
import {useSelector} from 'react-redux';
import {useLoading} from '../Context';
import {RootState} from '../Redux/store';
import useProductDetail from './useProductDetail';
import ProductNetwork from '../Network/lib/product';
import ToastAlert from '../Components/Toast/Toast';
import {useToast} from 'native-base';
import {NavigationProp, useNavigation} from '@react-navigation/native';

const useEditPhoto = () => {
  const [deleteConfirmed, setDeleteConfirmed] = useState<boolean>(false);
  const productID = useSelector(
    (state: RootState) => state.productSlice?.productId,
  );
  const dataCamera = useSelector(
    (state: RootState) => state.uploadSlice.dataCamera,
  );

  const categoryCode = useSelector(
    (state: RootState) => state.productSlice?.categoryCode,
  );
  const navigation = useNavigation<NavigationProp<any>>();
  const {imageId} = useProductDetail();
  const {setLoading} = useLoading();
  const toast = useToast();

  const handleDeletedPhoto = (): void => {
    return setDeleteConfirmed(true);
  };

  type productProps = {
    name: string;
    code: string;
    price: number | null;
    description: string;
  };

  const submit = async ({
    name,
    code,
    description,
    price,
  }: productProps): Promise<void> => {
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('code', code);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('status', 1);
      formData.append('_method', 'PUT');
      formData.append('category', categoryCode);
      if (dataCamera) {
        const imagesArray = [];
        imagesArray.push({
          uri: dataCamera?.uri,
          name: dataCamera?.fileName,
          size: dataCamera?.fileSize,
          type: dataCamera?.type,
        });
        formData.append('images[]', imagesArray[0]);
      }
      const response = await ProductNetwork.edit({
        id: productID,
        data: formData,
      });
      if (response) {
        setLoading(false);
        ToastAlert(toast, 'sukses', 'Produk Berhasil Diubah');
        navigation.navigate('Dashboard', {screen: 'Catalogue'});
      }
    } catch (error) {
      setLoading(false);
      if (axios.isAxiosError(error)) {
        ToastAlert(toast, 'error', error?.response?.data?.message);
      }
    }
  };

  const handleSubmit = async ({
    name,
    code,
    description,
    price,
  }: productProps) => {
    setLoading(true);
    if (deleteConfirmed) {
      console.log('kena');

      try {
        const response = await ProductNetwork.deleteImages({
          id: imageId,
        });
        if (response) {
          submit({name, code, description, price});
          return response.data;
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        ToastAlert(toast, 'error', 'Gagal Hapus Foto');
        throw error;
      }
    } else {
      submit({name, code, description, price});
    }
  };

  return {
    handleSubmit,
    handleDeletedPhoto,
  };
};

export default useEditPhoto;
