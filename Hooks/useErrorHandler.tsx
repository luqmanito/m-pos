import {useState} from 'react';
import {ErrorModel} from '../models/ErrorModel';

const useErrorHandler = () => {
  const [errorBag, setErrorBag] = useState<ErrorModel | undefined>(undefined);

  const getFormError = (key: string): string => {
    if (errorBag && errorBag.errors && errorBag.errors[key]) {
      return errorBag.errors[key][0];
    } else {
      return '';
    }
  };

  const isInvalid = (key: string): boolean => {
    if (errorBag && errorBag.errors && errorBag.errors[key]) {
      return true;
    } else {
      return false;
    }
  };

  const setFormErrors = (errors: ErrorModel | undefined) => {
    setErrorBag(errors);
  };

  const clearFormErrors = () => {
    setErrorBag(undefined);
  };

  return {
    getFormError,
    errorBag,
    setFormErrors,
    clearFormErrors,
    isInvalid,
  };
};
export default useErrorHandler;
