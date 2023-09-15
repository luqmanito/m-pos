import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useLoading} from '../Context';
import {OrderDetail} from '../models/OrderDetail';
import orderNetwork from '../Network/lib/order';
import {createPayment} from '../Redux/Reducers/payment';
import {RootState} from '../Redux/store';

const useOrderDetails = () => {
  const [orders, setOrders] = useState<OrderDetail>();
  const {setLoading} = useLoading();
  const dispatch = useDispatch();

  const idState = useSelector(
    (state: RootState) => state.buttonSlice?.activeId,
  );

  useEffect(() => {
    const fetchProducts = async (): Promise<void> => {
      setLoading(true);
      try {
        if (idState) {
          const response = await orderNetwork.detail(idState);
          if (response) {
            setLoading(false);
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
        setLoading(false);
        console.error('Error fetching products:', error);
        throw error;
      }
    };
    fetchProducts();
  }, [setLoading, dispatch, idState]);
  return orders;
};

export default useOrderDetails;
