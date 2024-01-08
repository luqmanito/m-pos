import {Button, Text, View} from 'native-base';
import React, {useContext, useEffect, useState} from 'react';
import {PrimaryColorContext, useLoading} from '../../Context';
import NavBar from '../../Components/Navbar/Navbar';
import useCategories from '../../Hooks/useCategory';
import usePaymentSubmit from '../../Hooks/useSubmitPayment';
import cache from '../../Util/cache';
import {getCurrentDateTime} from '../../Util/Date/Time';
import {useTranslation} from 'react-i18next';

const SyncDataScreen = () => {
  const {loading} = useLoading();
  const [dataSync, setDataSync] = useState([]);
  const fetchDataSubmission = async (): Promise<void> => {
    let dataSubmissions = await cache.get('paymentSubmissions');
    setDataSync(dataSubmissions);
  };
  const {t} = useTranslation();
  const {fetchCategories} = useCategories();
  const {submitPayment} = usePaymentSubmit();
  const primaryColor = useContext(PrimaryColorContext);
  useEffect(() => {
    fetchDataSubmission();
  }, [dataSync]);

  return (
    <>
      <NavBar msg="Penyelarasan" />
      <View mx={4}>
        <View>
          <Text mt={4} bold fontSize={'3xl'}>
            {t('transaction')}
          </Text>
          <Text fontSize={'xl'} mt={2}>
            {t('there')}
            <Text bold> {dataSync?.length ? dataSync?.length : '0'} </Text>
            {t('on-local')}
          </Text>
        </View>
        <View mt={4}>
          <Button
            isLoading={loading}
            isLoadingText={'loading'}
            onPress={() => {
              submitPayment(dataSync);
            }}
            isDisabled={dataSync === null || dataSync.length === 0}
            bg={primaryColor?.primaryColor}
            borderRadius={10}>
            <Text color={'white'} fontSize={'lg'}>
              {t('send-data')}
            </Text>
          </Button>
        </View>
        <View>
          <Text mt={4} bold fontSize={'3xl'}>
            {t('product')}
            <Text fontSize={'xl'} italic>
              {` (terakhir di update : ${getCurrentDateTime()})`}
            </Text>
          </Text>
          <Text fontSize={'xl'} mt={2}>
            {t('take-data')}
          </Text>
        </View>
        <View mt={4}>
          <Button
            isLoading={loading}
            isLoadingText={'loading'}
            onPress={() => {
              fetchCategories();
            }}
            bg={primaryColor?.primaryColor}
            borderRadius={10}>
            <Text color={'white'} fontSize={'lg'}>
              {t('download-data')}
            </Text>
          </Button>
        </View>
      </View>
    </>
  );
};

export default SyncDataScreen;
