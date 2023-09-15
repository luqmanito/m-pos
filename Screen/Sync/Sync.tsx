import {Button, Text, View} from 'native-base';
import React, {useEffect, useState} from 'react';
import {useLoading} from '../../Context';
import {getCurrentDateTime} from '../../Components/Date/Time';
import NavBar from '../../Components/Navbar/Navbar';
import useCategories from '../../Hooks/useCategory';
import useProducts from '../../Hooks/useProducts';
import usePaymentSubmit from '../../Hooks/useSubmitPayment';
import cache from '../../Util/cache';

const SyncDataScreen = () => {
  const [dataSync, setDataSync] = useState([]);
  const {loading} = useLoading();
  const fetchDataSubmission = async (): Promise<void> => {
    let dataSubmissions = await cache.get('paymentSubmissions');
    setDataSync(dataSubmissions);
  };
  const {fetchAllProductsCache} = useProducts('cashier');
  const {fetchCategories} = useCategories();
  const {submitPayment} = usePaymentSubmit();

  useEffect(() => {
    fetchDataSubmission();
  }, [dataSync]);

  return (
    <>
      <NavBar msg="Penyelarasan" />
      <View mx={4}>
        <View>
          <Text mt={4} bold fontSize={'3xl'}>
            Transaksi
            <Text fontSize={'xl'} italic>
              {` (terakhir di update : ${getCurrentDateTime()})`}
            </Text>
          </Text>
          <Text fontSize={'xl'} mt={2}>
            Terdapat
            <Text bold> {dataSync?.length ? dataSync?.length : '0'} </Text>
            transaksi tersimpan di local
          </Text>
        </View>
        <View mt={4}>
          <Button
            isLoading={loading}
            isLoadingText={'loading'}
            onPress={() => {
              submitPayment(dataSync);
              // fetchAllProductsCache();
            }}
            isDisabled={dataSync === null || dataSync.length === 0}
            bg={'#0c50ef'}
            borderRadius={10}>
            <Text color={'white'} fontSize={'lg'}>
              Kirim data transaksi
            </Text>
          </Button>
        </View>
        <View>
          <Text mt={4} bold fontSize={'3xl'}>
            Produk
            <Text fontSize={'xl'} italic>
              {` (terakhir di update : ${getCurrentDateTime()})`}
            </Text>
          </Text>
          <Text fontSize={'xl'} mt={2}>
            Ambil data produk dari server
          </Text>
        </View>
        <View mt={4}>
          <Button
            isLoading={loading}
            isLoadingText={'loading'}
            // isDisabled={}
            onPress={() => {
              fetchCategories();
              fetchAllProductsCache();
            }}
            bg={'#0c50ef'}
            borderRadius={10}>
            <Text color={'white'} fontSize={'lg'}>
              Download data produk
            </Text>
          </Button>
        </View>
      </View>
    </>
  );
};

export default SyncDataScreen;
