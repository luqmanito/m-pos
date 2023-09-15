import {useSelector} from 'react-redux';
import {useLoading} from '../Context';
import {RootState} from '../Redux/store';
import ProductNetwork from '../Network/lib/product';
import ToastAlert from '../Components/Toast/Toast';
import {useToast} from 'native-base';
import {NavigationProp, useNavigation} from '@react-navigation/native';

const useDeleteProduct = () => {
  const toast = useToast();
  const navigation = useNavigation<NavigationProp<any>>();
  const productID = useSelector(
    (state: RootState) => state.productSlice?.productId,
  );
  const {setLoading} = useLoading();
  const handleSubmitDelete = async () => {
    setLoading(true);
    try {
      const response = await ProductNetwork.deleteProduct({
        id: productID,
      });
      if (response) {
        setLoading(false);
        navigation.navigate('Dashboard', {screen: 'Catalogue'});
        return response.data;
      }
    } catch (error) {
      setLoading(false);
      // setIsOpen(false);
      console.error('Error fetching products:', error);
      ToastAlert(toast, 'error', 'Gagal Hapus Produk');
      throw error;
    }
  };

  return {
    handleSubmitDelete,
  };
};

export default useDeleteProduct;
