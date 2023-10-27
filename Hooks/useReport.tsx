import {useEffect, useState} from 'react';
import {dates} from '../Components/Date/Today';
import {
  ReportModelPaymentMethods,
  ReportModelTotalTransaction,
} from '../models/ReportModel';

import ReportNetwork from '../Network/lib/report';

type PropsType = {
  name: string;
  value: string;
};

export const useReport = () => {
  const [date, setDate] = useState({
    start_date: dates,
    end_date: dates,
  });

  const [reportDataPayment, setReportDataPayment] =
    useState<ReportModelPaymentMethods[]>();
  const [reportDataTotal, setReportDataTotal] =
    useState<ReportModelTotalTransaction[]>();

  const handleChange = ({name, value}: PropsType) => {
    setDate({
      ...date,
      [name]: value,
    });
  };

  useEffect(() => {
    const fetchDataPaymentMethods = async () => {
      try {
        const response = await ReportNetwork.listByPaymentMethods({
          start_date: date?.start_date,
          end_date: date?.end_date,
        });
        if (response) {
          setReportDataPayment(response?.data?.report);
          console.log(response?.data);
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
          setReportDataTotal(response?.data?.report);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchDataPaymentMethods();
    fethcDataTotalTransactions();

    // return () => {
    //   second;
    // };
  }, [date?.end_date, date?.start_date]);

  return {
    handleChange,
    reportDataTotal,
    reportDataPayment,
  };
};
