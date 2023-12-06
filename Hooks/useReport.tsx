import {useIsFocused} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {dates} from '../Components/Date/Today';
import ReportNetwork from '../Network/lib/report';
import {
  setPendingTransaction,
  setReportDataPayment,
  setReportDataTotal,
} from '../Redux/Reducers/report';
import {RootState} from '../Redux/store';
import cache from '../Util/cache';

type PropsType = {
  name: string;
  value: string;
};

export const useReport = () => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [date, setDate] = useState({
    start_date: dates,
    end_date: dates,
  });
  const [fetchData, setFetchData] = useState(false);
  const reportDataTotal = useSelector(
    (state: RootState) => state.reportSlice.reportDataTotal,
  );
  const reportDataPayment = useSelector(
    (state: RootState) => state.reportSlice.reportDataPayment,
  );
  const pendingOrder = useSelector(
    (state: RootState) => state.reportSlice.pendingTransaction,
  );

  const handleChange = ({name, value}: PropsType) => {
    setDate({
      ...date,
      [name]: value,
    });
  };

  const handleRefresh = () => {
    setFetchData(prevToggle => !prevToggle);
  };

  useEffect(() => {
    const fetchDataPaymentMethods = async () => {
      try {
        const response = await ReportNetwork.listByPaymentMethods({
          start_date: date?.start_date,
          end_date: date?.end_date,
        });
        if (response) {
          dispatch(setReportDataPayment(response?.data?.report));
        }
      } catch (error) {
        console.error(error);
      }
    };
    const fethcDataTotalTransactions = async () => {
      try {
        const response = await ReportNetwork.listByTotalTransactions({
          start_date: date?.start_date,
          end_date: date?.end_date,
        });
        if (response) {
          dispatch(setReportDataTotal(response?.data?.report));
        }
      } catch (error) {
        console.error(error);
      }
    };
    const pendingStatus = async (): Promise<void> => {
      let dataSubmissions = await cache.get('paymentSubmissions');
      dispatch(setPendingTransaction(dataSubmissions));
    };

    if (isFocused) {
      fetchDataPaymentMethods();
      fethcDataTotalTransactions();
      pendingStatus();
    }
  }, [date?.end_date, date?.start_date, isFocused, fetchData, dispatch]);

  return {
    handleChange,
    reportDataTotal,
    reportDataPayment,
    pendingOrder,
    handleRefresh,
  };
};
