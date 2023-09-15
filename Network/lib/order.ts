import {AxiosResponse} from 'axios';
import {OrderDetail} from '../../models/OrderDetail';
import {RootOrderModel} from '../../models/OrderModel';
import {PaymentModel} from '../../models/PaymentModel';
import axiosClient from '../axiosClient';

interface payModel {
  table_no: string;
  payment_method: number | null;
  total_paid: number;
  products: object;
  ref: string;
}
interface orderListProps {
  search: string;
  page: number;
}

export default {
  pay({products, table_no, payment_method, total_paid, ref}: payModel) {
    return axiosClient.post<PaymentModel>('api/orders', {
      products,
      table_no,
      payment_method,
      total_paid,
      ref,
    });
  },
  list({search, page}: orderListProps): Promise<AxiosResponse<RootOrderModel>> {
    return axiosClient.get(
      `api/orders?load=products.product.photos,createdBy&search=${search}&page=${page}`,
    );
  },
  detail(id: number) {
    return axiosClient.get<OrderDetail>(
      `api/orders/${id}?load=products.product.photos,createdBy`,
    );
  },
};
