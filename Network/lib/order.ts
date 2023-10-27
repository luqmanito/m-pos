import {AxiosResponse} from 'axios';
import {OrderDetail} from '../../models/OrderDetail';
import {RootOrderModel} from '../../models/OrderModel';
import {PaymentModel} from '../../models/PaymentModel';
import axiosClient from '../axiosClient';

interface payModel {
  id?: string | number;
  table_no: string;
  payment_method: number | null;
  total_paid: number;
  products: object;
  ref: string;
  created_by?: string;
  name: string;
  phone: string;
  email: string;
}
interface updateModel {
  id?: string | number;
  table_no: string;
  products: object;
  created_by?: string;
}
interface orderListProps {
  search: string;
  page: number;
  status: string;
}

export default {
  pay({
    products,
    table_no,
    payment_method,
    total_paid,
    ref,
    name,
    phone,
    email,
  }: payModel) {
    return axiosClient.post<PaymentModel>('api/orders', {
      products,
      table_no,
      payment_method,
      total_paid,
      ref,
      name,
      phone,
      email,
    });
  },
  updateOrder({products, table_no, created_by, id}: updateModel) {
    return axiosClient.put<PaymentModel>(`api/orders/${id}`, {
      table_no,
      products,
      created_by,
    });
  },
  confirmOrder(id: undefined | number) {
    return axiosClient.patch<PaymentModel>(`api/orders/${id}/confirm`);
  },
  orderReady(id: undefined | number) {
    return axiosClient.patch<PaymentModel>(`api/orders/${id}/ready`);
  },
  orderCompleted(id: undefined | number) {
    return axiosClient.patch<PaymentModel>(`api/orders/${id}/completed`);
  },
  list({
    search,
    page,
    status,
  }: orderListProps): Promise<AxiosResponse<RootOrderModel>> {
    return axiosClient.get(
      `api/orders?load=products.product.photos,createdBy&search=${search}&page=${page}&per_page=10000${
        status ? `&statuses=${status}` : ''
      }`,
    );
  },
  detail(id: number) {
    return axiosClient.get<OrderDetail>(
      `api/orders/${id}?load=products.product.photos,createdBy`,
    );
  },
};
