import {useState} from 'react';
import {useSelector} from 'react-redux';
import {useLoading} from '../Context';
import {RootState} from '../Redux/store';

import ProductNetwork from '../Network/lib/product';
import ToastAlert from '../Components/Toast/Toast';
import {useToast} from 'native-base';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import useErrorHandler from './useErrorHandler';
import useAlert from './useAlert';

const useEditPhoto = () => {
  const [deleteConfirmed, setDeleteConfirmed] = useState<boolean>(false);

  const dataCamera = useSelector(
    (state: RootState) => state.uploadSlice.dataCamera,
  );

  const categoryCode = useSelector(
    (state: RootState) => state.productSlice?.categoryCode,
  );
  const navigation = useNavigation<NavigationProp<any>>();

  const imageId = useSelector(
    (state: RootState) => state.productSlice?.imageID,
  );
  const {setLoading} = useLoading();
  const toast = useToast();

  const handleDeletedPhoto = (): void => {
    return setDeleteConfirmed(true);
  };
  const {setFormErrors} = useErrorHandler();
  type productProps = {
    name: string;
    code: string;
    price: number | null;
    productId?: number | null;
    description: string;
  };
  const alert = useAlert();

  const handleAddSubmit = async ({
    name,
    code,
    description,
    price,
  }: productProps) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('code', code);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('status', 1);
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
    ProductNetwork.create(formData)
      .then(() => {
        alert.showAlert('success', 'Produk Berhasil Ditambahkan');
        navigation.navigate('Dashboard', {screen: 'Catalogue'});
      })
      .catch(err => {
        setFormErrors(err);
        alert.showAlert('error', err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const submit = async ({
    name,
    code,
    description,
    price,
    productId,
  }: productProps): Promise<void> => {
    setLoading(true);
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
    ProductNetwork.edit({id: productId, formData})
      .then(() => {
        alert.showAlert('success', 'Produk Berhasil Dirubah');
        navigation.navigate('Dashboard', {screen: 'Catalogue'});
      })
      .catch(err => {
        setFormErrors(err);
        alert.showAlert('error', err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSubmit = async ({
    name,
    code,
    description,
    price,
    productId,
  }: productProps) => {
    setLoading(true);
    if (deleteConfirmed) {
      try {
        const response = await ProductNetwork.deleteImages({
          id: imageId,
        });
        if (response) {
          submit({name, code, description, price, productId});
          return response.data;
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        ToastAlert(toast, 'error', 'Gagal Hapus Foto');
        throw error;
      } finally {
        setLoading(false);
      }
    } else {
      submit({name, code, description, price, productId});
    }
  };

  return {
    handleSubmit,
    handleAddSubmit,
    handleDeletedPhoto,
  };
};

export default useEditPhoto;
