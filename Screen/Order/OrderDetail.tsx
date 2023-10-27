import React, {useCallback, useContext} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Divider,
  HStack,
  Badge,
} from 'native-base';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useFocusEffect} from '@react-navigation/native';
import {clearStateProduct} from '../../Redux/Reducers/product';
import {useDispatch} from 'react-redux';
import {clearDataCamera} from '../../Redux/Reducers/upload';
import noImage from '../../Public/Assets/no-Image.jpg';
import RupiahFormatter from '../../Components/Rupiah/Rupiah';
import formatDate from '../../Components/Date/Date';
import NavBar from '../../Components/Navbar/Navbar';
import PrintReceipt from '../Printer/Components/PrintReceipt';
import {PrimaryColorContext, useLoading} from '../../Context';
import useOrderDetails from '../../Hooks/useOrderDetail';
import {StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import {skeletonItems} from './Components/Loading';

export const OrderDetailScreen: React.FC = () => {
  const dispatch = useDispatch();
  const {loading} = useLoading();
  const primaryColor = useContext(PrimaryColorContext);
  const orders = useOrderDetails();
  useFocusEffect(
    useCallback(() => {
      dispatch(clearStateProduct());
      dispatch(clearDataCamera());
    }, [dispatch]),
  );

  const renderSkeletonItems = () => {
    return (
      <>
        {skeletonItems.map((item, index) => (
          <React.Fragment key={index}>{item}</React.Fragment>
        ))}
      </>
    );
  };

  return (
    <>
      <NavBar msg={'Detail Pesanan'} />
      {loading ? (
        <>{renderSkeletonItems()}</>
      ) : (
        <>
          <ScrollView>
            <View
              mt={4}
              mx={4}
              borderRadius={14}
              borderTopColor={'gray.200'}
              bg={'white'}>
              <View my={4} flexDirection={'row'}>
                <Text mx={4} fontSize={'lg'} flex={2} color={'black'} bold>
                  Informasi Pesanan
                </Text>
              </View>
              <Divider />
              <View mx={4} mt={4} bg="white">
                <View
                  mx={4}
                  flexDirection={'row'}
                  justifyContent={'space-between'}>
                  <View alignSelf={'flex-start'}>
                    <Text mt={3}>Status</Text>
                  </View>
                  <View alignSelf={'flex-end'} mt={3}>
                    <Badge
                      colorScheme="success"
                      alignSelf="center"
                      borderRadius={14}
                      variant={'subtle'}>
                      <Text bold color={'#2ebd53'}>
                        Selesai
                      </Text>
                    </Badge>
                  </View>
                </View>
                <View
                  mx={4}
                  flexDirection={'row'}
                  justifyContent={'space-between'}>
                  <View alignSelf={'flex-start'}>
                    <Text mt={3}>Nomor Pesanan</Text>
                  </View>
                  <View alignSelf={'flex-end'} mt={3}>
                    <Text bold color={'black'}>
                      {orders?.order_code}
                    </Text>
                  </View>
                </View>
                <View
                  mx={4}
                  flexDirection={'row'}
                  justifyContent={'space-between'}>
                  <View alignSelf={'flex-start'}>
                    <Text mt={3}>Waktu Pembayaran</Text>
                  </View>
                  <View alignSelf={'flex-end'} mt={3}>
                    <Text bold color={'black'}>
                      {formatDate(orders?.created_at)}
                    </Text>
                  </View>
                </View>
                <View
                  mx={4}
                  flexDirection={'row'}
                  justifyContent={'space-between'}>
                  <View alignSelf={'flex-start'}>
                    <Text mt={3}>Status</Text>
                  </View>
                  <View alignSelf={'flex-end'} mt={3}>
                    <Text bold>
                      {orders?.total_paid ? 'Tunai' : 'non-Tunai'}
                    </Text>
                  </View>
                </View>
                {orders?.table_no ? (
                  <View
                    mx={4}
                    flexDirection={'row'}
                    justifyContent={'space-between'}>
                    <View alignSelf={'flex-start'}>
                      <Text mt={3}>Keterangan Meja</Text>
                    </View>
                    <View alignSelf={'flex-end'} mt={3}>
                      <Text bold>{orders?.table_no}</Text>
                    </View>
                  </View>
                ) : null}
                <View
                  mx={4}
                  flexDirection={'row'}
                  justifyContent={'space-between'}>
                  <View alignSelf={'flex-start'}>
                    <Text mt={3}>Nama Kasir</Text>
                  </View>
                  <View alignSelf={'flex-end'} mt={3}>
                    <Text mb={4} bold>
                      {orders?.created_by?.name}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            {orders?.products?.map((item, index) => {
              return (
                <View
                  key={item?.id}
                  mb={index === orders?.products?.length - 1 ? 8 : 0}
                  mt={index === 0 ? 4 : 0}
                  mx={4}
                  borderBottomRadius={
                    index === orders?.products?.length - 1 ? 10 : 0
                  }
                  borderTopRadius={index === 0 ? 10 : 0}
                  borderTopColor={'gray.200'}
                  bg={'white'}>
                  {index === 0 ? (
                    <View my={4} flexDirection={'row'}>
                      <Text
                        mx={4}
                        fontSize={'lg'}
                        flex={2}
                        color={'black'}
                        bold>
                        Daftar Pesanan
                      </Text>
                    </View>
                  ) : null}

                  <View
                    mt={index === 0 ? 0 : 4}
                    mb={index === 0 ? 0 : 4}
                    mx={4}>
                    <HStack mx={4}>
                      <View>
                        {item?.product?.photos.length !== 0 ? (
                          <FastImage
                            style={styles.image}
                            source={{
                              uri: item?.product?.photos[0]?.original_url,
                              priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.contain}
                          />
                        ) : (
                          <Image
                            source={noImage}
                            alt={'foto-produk'}
                            style={styles.image}
                            resizeMode="contain"
                          />
                        )}
                      </View>
                      <View mx={4} my={4}>
                        <Text bold>{item?.name}</Text>
                        <Text color={'#848aac'} bold>
                          {`${RupiahFormatter(item?.price)}` +
                            ' x' +
                            ` ${item?.quantity}`}
                        </Text>
                      </View>
                    </HStack>
                    {item?.note ? (
                      <View
                        borderRadius={10}
                        mx={4}
                        mb={4}
                        p={2}
                        alignSelf="center"
                        flexDirection={'row'}
                        bg={'#f4f5fa'}>
                        <Text ml={4} color="black" flex={2}>
                          {item?.note}
                        </Text>
                      </View>
                    ) : null}
                    {index === orders?.products?.length - 1 ? (
                      <View
                        mt={4}
                        mb={orders?.products?.length === 1 ? 4 : 0}
                        flexDirection={'row'}>
                        <Text textAlign={'center'} flex={1} fontSize={'lg'}>
                          <MaterialCommunityIcons
                            name="download"
                            size={20}
                            color={primaryColor?.primaryColor}
                          />
                          Download Struk
                        </Text>
                        <Text textAlign={'center'} flex={1} fontSize={'lg'}>
                          <MaterialCommunityIcons
                            name="share-variant"
                            size={20}
                            color={primaryColor?.primaryColor}
                          />
                          Bagikan Struk
                        </Text>
                      </View>
                    ) : null}
                  </View>
                  {index === orders?.products?.length - 1 ? null : (
                    <Divider mx={4} w={'90%'} />
                  )}
                </View>
              );
            })}
          </ScrollView>

          <View borderTopColor={'gray.200'} bg={'#f4f5fa'} bottom={4}>
            <View p={2} mx={4} flexDirection={'row'}>
              <Text flex={3} bold>
                Total Tagihan
              </Text>
              <Text flex={1} bold>
                {RupiahFormatter(orders?.total)}
              </Text>
            </View>
          </View>
        </>
      )}

      <View bg={'#f4f5fa'} bottom={18} mx={4}>
        <PrintReceipt />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 80,
    height: 80,
  },
});
