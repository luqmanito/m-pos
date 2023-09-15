import {useIsFocused} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {DataSubmissionDetail} from '../models/DataSubmission';
import cache from '../Util/cache';

const useDataSubmission = () => {
  const isFocused = useIsFocused();
  const [cacheDataSubmissions, setCacheDataSubmissions] = useState<
    DataSubmissionDetail[]
  >([]);

  useEffect(() => {
    const fetchDataSubmission = async (): Promise<void> => {
      let dataSubmissions = await cache.get('paymentSubmissions');
      setCacheDataSubmissions(dataSubmissions);
    };
    if (isFocused) {
      fetchDataSubmission();
    }
  }, [cacheDataSubmissions, isFocused]);

  return {cacheDataSubmissions};
};

export default useDataSubmission;
