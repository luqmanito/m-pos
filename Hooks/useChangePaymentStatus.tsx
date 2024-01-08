import {useLoading} from '../Context';

import PaymentNetwork from '../Network/lib/payment';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import useAlert from './useAlert';
import {useTranslation} from 'react-i18next';

type Props = {
  payment_method_id: number | null;
  status: number | null;
};

const useChangePaymentStatus = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const alert = useAlert();
  const {t} = useTranslation();
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
        alert.showAlert('success', t('change-status'));
        return response.data;
      }
    } catch (error) {
      setLoading(false);
      alert.showAlert('error', t('change-fail'));
      throw error;
    }
  };

  return {
    submitChange,
  };
};

export default useChangePaymentStatus;
