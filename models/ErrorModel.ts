export interface ErrorModel {
  message: string;
  errors?: {
    [fieldName: string]: string[];
  };
}
