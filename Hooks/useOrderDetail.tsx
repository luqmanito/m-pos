import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {OrderDetail} from '../models/OrderDetail';
import orderNetwork from '../Network/lib/order';
import {createPayment} from '../Redux/Reducers/payment';
import {RootState} from '../Redux/store';

const useOrderDetails = () => {
  const [orders, setOrders] = useState<OrderDetail>();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const idState = useSelector(
    (state: RootState) => state.buttonSlice?.activeId,
  );

  useEffect(() => {
    const fetchProducts = async (): Promise<void> => {
      setIsLoading(true);
      try {
        if (idState) {
          const response = await orderNetwork.detail(idState);
          if (response) {
            setIsLoading(false);
            dispatch(
              createPayment({
                products: response?.data?.products,
                totalPrice: response?.data?.total,
                totalPayment: response?.data?.total_paid,
                exchangePayment:
                  response?.data?.total - response?.data?.total_paid,
                invoiceNumber: response?.data?.order_code,
                datePayment: response?.data?.created_at,
                cashierName: response?.data?.created_by?.name,
              }),
            );
            setOrders(response?.data);
          }
        }
      } catch (error) {
        setIsLoading(false);
        console.error('Error fetching products:', error);
        throw error;
      }
    };
    fetchProducts();
  }, [dispatch, idState]);
  return {orders, isLoading};
};

export default useOrderDetails;
