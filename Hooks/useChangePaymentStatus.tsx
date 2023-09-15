import {useLoading} from '../Context';

import PaymentNetwork from '../Network/lib/payment';
import ToastAlert from '../Components/Toast/Toast';
import {useToast} from 'native-base';
import {NavigationProp, useNavigation} from '@react-navigation/native';

type Props = {
  payment_method_id: number | null;
  status: number | null;
};

const useChangePaymentStatus = () => {
  const navigation = useNavigation<NavigationProp<any>>();

  const toast = useToast();
  const {setLoading} = useLoading();

  const submitChange = async ({payment_method_id, status}: Props) => {
    setLoading(true);
    try {
      const response = await PaymentNetwork.editStatus({
        payment_method_id,
        status: status === 1 ? 0 : 1,
        _method: 'PUT',
      });
      if (response) {
        setLoading(false);

        navigation.navigate('SettingScreen');
        ToastAlert(toast, 'sukses', 'Berhasil Mengubah Status Pembayaran');
        return response.data;
      }
    } catch (error) {
      setLoading(false);
      ToastAlert(toast, 'error', 'Gagal Mengubah Status');
      throw error;
    }
  };

  return {
    submitChange,
  };
};

export default useChangePaymentStatus;
