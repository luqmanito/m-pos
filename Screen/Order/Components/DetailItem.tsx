import {
  Button,
  Divider,
  HStack,
  Image,
  ScrollView,
  Skeleton,
  Text,
  View,
} from 'native-base';
import React, {useContext} from 'react';
import FastImage from 'react-native-fast-image';
import noImage from '../../../Public/Assets/no-Image.jpg';
import {useSelector} from 'react-redux';
import {PrimaryColorContext, useLoading} from '../../../Context';
import {StyleSheet} from 'react-native';
import useOrderDetails from '../../../Hooks/useOrderDetail';
import {RootState} from '../../../Redux/store';
import usePaymentSubmit from '../../../Hooks/useSubmitPayment';
import {useTranslation} from 'react-i18next';

interface Props {
  onClose: () => void;
}

const DetailItem: React.FC<Props> = ({onClose}) => {
  const {t} = useTranslation();
  const primaryColor = useContext(PrimaryColorContext);
  const isLoading = useOrderDetails()?.isLoading;
  const {confirmOrder} = usePaymentSubmit();
  const detailOrderItems = useSelector(
    (state: RootState) => state.orderSlice.order_detail,
  );
  const {loading} = useLoading();

  return (
    <>
      <View alignItems={'center'}>
        <Text bold fontSize={'2xl'}>
          {t('order-detail')}
        </Text>
        {isLoading ? (
          <Skeleton p={3} minH="545" />
        ) : (
          <ScrollView w={'100%'}>
            {detailOrderItems?.products?.map((item, index) => {
              return (
                <View
                  key={item?.id}
                  mb={index === detailOrderItems?.products?.length - 1 ? 8 : 0}
                  mt={index === 0 ? 4 : 0}
                  pb={4}
                  mx={4}
                  borderBottomRadius={
                    index === detailOrderItems?.products?.length - 1 ? 10 : 0
                  }
                  borderTopRadius={index === 0 ? 10 : 0}
                  borderTopColor={'gray.200'}
                  bg={'white'}>
                  {index === 0 ? (
                    <View
                      my={4}
                      flexDirection={'row'}
                      justifyContent="space-between">
                      <View>
                        <Text
                          mx={4}
                          fontSize={'lg'}
                          flex={2}
                          color={'black'}
                          bold>
                          {t('list-order')}
                        </Text>
                      </View>
                      <View>
                        <Text
                          mx={4}
                          fontSize={'lg'}
                          flex={2}
                          color={'black'}
                          bold>
                          {t('name-cs-info')}
                          {' :'}
                          {detailOrderItems.customer_name || '-'}
                        </Text>
                      </View>
                    </View>
                  ) : null}

                  <View
                    mt={index === 0 ? 0 : 4}
                    mb={index === 0 ? 0 : 4}
                    mx={4}>
                    <HStack py={2} mx={4}>
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
                          {`${item?.quantity} Porsi`}
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
                  </View>
                  {index === detailOrderItems?.products?.length - 1 ? null : (
                    <Divider mx={4} w={'90%'} />
                  )}
                </View>
              );
            })}

            <View flex={1} justifyContent="center" flexDirection={'row'}>
              <Button
                w={'45%'}
                isLoading={loading}
                isLoadingText="Loading"
                onPress={() => {
                  confirmOrder();
                  onClose();
                }}
                mx={4}
                mb={4}
                borderRadius={10}
                bg={primaryColor?.primaryColor}>
                <Text color={'white'} bold>
                  {t('confirm')}
                </Text>
              </Button>
            </View>
          </ScrollView>
        )}
      </View>
    </>
  );
};

export default DetailItem;

const styles = StyleSheet.create({
  iconSearch: {
    marginLeft: 5,
  },
  image: {
    width: 80,
    height: 80,
  },
  wifi: {
    marginLeft: 10,
    color: '#2dbf52',
  },
  wifi_off: {
    marginLeft: 10,
    color: '#fc2b0c',
  },
});
