import {AxiosResponse} from 'axios';
import {
  RootReportModelPaymentMethods,
  RootReportModelTotalTransaction,
} from '../../models/ReportModel';
import axiosClient from '../axiosClient';

interface ListProps {
  start_date: string | null;
  end_date: string | null;
}

// export default {
//   listByPaymentMethods({
//     start_date,
//     end_date,
//   }: ListProps): Promise<AxiosResponse<RootReportModelPaymentMethods>> {
//     return axiosClient.get(
//       `api/reports/by-payment-methods?start_date=${start_date}&end_date=${end_date}`,
//     );
//   },
//   listByTotalTransactions({
//     start_date,
//     end_date,
//   }: ListProps): Promise<AxiosResponse<RootReportModelTotalTransaction>> {
//     return axiosClient.get(
//       `api/reports/by-total-transaction?start_date=${start_date}&end_date=${end_date}`,
//     );
//   },
// };

export default {
  listByPaymentMethods({
    start_date,
    end_date,
  }: ListProps): Promise<AxiosResponse<RootReportModelPaymentMethods>> {
    return axiosClient.get('api/reports/by-payment-methods', {
      params: {
        start_date,
        end_date,
      },
    });
  },

  listByTotalTransactions({
    start_date,
    end_date,
  }: ListProps): Promise<AxiosResponse<RootReportModelTotalTransaction>> {
    return axiosClient.get('api/reports/by-total-transaction', {
      params: {
        start_date,
        end_date,
      },
    });
  },
};
