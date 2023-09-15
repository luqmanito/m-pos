import React from 'react';
import {View, Text} from 'native-base';

import NavBar from '../../Components/Navbar/Navbar';
import useUserInfo from '../../Hooks/useUserInfo';

const AdminDetail = () => {
  const {userData} = useUserInfo();

  return (
    <>
      <NavBar msg="Detail Pegawai" />
      <View mx={4} mt={4}>
        <View bg={'white'} borderRadius={10}>
          <View my={4} mx={4} flexDirection={'row'}>
            <View ml={4} flex={8}>
              <Text>Nama Lengkap</Text>
              <Text fontSize={'xl'} bold>
                {userData?.name}
              </Text>
              <Text mt={4}>Nomor Handphone</Text>
              <Text fontSize={'xl'} bold>
                {userData?.business.phone}
              </Text>
            </View>
          </View>
        </View>
        <View mt={4} bg={'white'} borderRadius={10}>
          <View my={4} mx={4} flexDirection={'row'}>
            <View ml={4} flex={8}>
              <Text fontSize={'xl'} bold>
                {userData?.role}
              </Text>
              <Text mt={4}>
                Dapat menggunakan semua layanan atau fitur di aplikasi Hidup
                Merchant
              </Text>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

export default AdminDetail;
