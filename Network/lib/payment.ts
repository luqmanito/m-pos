import {AxiosResponse} from 'axios';
import {
  PaymentMethodModel,
  PaymentModelContent,
} from '../../models/PaymentMethod';
import axiosClient from '../axiosClient';

interface paymentModel {
  status: number | null;
  payment_method_id: number | null;
  _method: string;
}

export default {
  editStatus({status, payment_method_id, _method}: paymentModel) {
    return axiosClient.post<AxiosResponse<PaymentModelContent>>(
      'api/payment-methods',
      {
        status,
        payment_method_id,
        _method,
      },
    );
  },
  list(): Promise<AxiosResponse<PaymentMethodModel>> {
    return axiosClient.get('api/payment-methods');
  },
};
