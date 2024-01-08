import {useLoading} from '../Context';
import ProductNetwork from '../Network/lib/product';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import useAlert from './useAlert';
import {useTranslation} from 'react-i18next';

const useDeleteProduct = (id: number | null) => {
  const alert = useAlert();
  const {t} = useTranslation();
  const navigation = useNavigation<NavigationProp<any>>();
  const {setLoading} = useLoading();
  const handleSubmitDelete = async () => {
    setLoading(true);
    try {
      const response = await ProductNetwork.deleteProduct({
        id: id,
      });
      if (response) {
        alert.showAlert('success', t('del-item'));
        navigation.navigate('Dashboard', {screen: 'Catalogue'});
        return response.data;
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      alert.showAlert('error', t('del-fail'));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    handleSubmitDelete,
  };
};

export default useDeleteProduct;
