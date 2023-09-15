export interface RootReportModelTotalTransaction {
  report: ReportModelTotalTransaction[];
}

export interface ReportModelTotalTransaction {
  total: string;
  total_transaction: number;
  ref?: string;
}

export interface RootReportModelPaymentMethods {
  report: ReportModelPaymentMethods[];
}

export interface ReportModelPaymentMethods {
  name: string;
  total: string;
  total_transaction: number;
}
