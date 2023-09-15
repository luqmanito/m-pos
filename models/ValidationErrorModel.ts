export interface ValidationErrorModel {
  message?: string;
  errors?: Record<string, string[]>;
  code?: string;
}
