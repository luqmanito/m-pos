import React, {useContext} from 'react';
import {
  View,
  Button,
  Text,
  ScrollView,
  Divider,
  HStack,
  Skeleton,
} from 'native-base';
import {useSelector} from 'react-redux';
import {PrimaryColorContext, useLoading} from '../../../Context';
import {screenWidth} from '../../../App';
import useOrderDetails from '../../../Hooks/useOrderDetail';
import {RootState} from '../../../Redux/store';
import {useTranslation} from 'react-i18next';

interface ChildProps {
  orderReady: () => void;
  updateModal: (newValue: boolean) => void;
}

const DetailItem: React.FC<ChildProps> = ({updateModal, orderReady}) => {
  const {loading} = useLoading();
  const {t} = useTranslation();
  const isLoading = useOrderDetails()?.isLoading;
  const primaryColor = useContext(PrimaryColorContext);
  const detailOrderItems = useSelector(
    (state: RootState) => state.orderSlice.order_detail,
  );

  return (
    <>
      <View
        ml={screenWidth > 600 ? 4 : 0}
        pb={screenWidth > 600 ? '48' : 0}
        alignItems={'center'}
        w={screenWidth > 600 ? '70%' : 'full'}>
        <Text bold fontSize={'2xl'}>
          {t('order-detail')}
        </Text>
        {isLoading ? (
          <Skeleton p={3} minH="545" />
        ) : (
          <ScrollView w={'100%'}>
            <Text mx={8} fontSize={'lg'} flex={2} bold color={'#848aac'}>
              {t('table-number')} {detailOrderItems?.table_no || '-'}
            </Text>
            {detailOrderItems?.products?.map((item, index) => {
              return (
                <View
                  key={item?.id}
                  mb={index === detailOrderItems?.products?.length - 1 ? 4 : 0}
                  mt={index === 0 ? 2 : 0}
                  mx={4}
                  borderBottomRadius={
                    index === detailOrderItems?.products?.length - 1 ? 10 : 0
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
                        {t('list-order')}
                      </Text>
                      <Text
                        mx={4}
                        fontSize={'lg'}
                        flex={2}
                        color={'black'}
                        bold>
                        {t('customer-name')}
                        {': '}
                        {detailOrderItems.customer_name || '-'}
                      </Text>
                    </View>
                  ) : null}
                  <View
                    mt={index === 0 ? 0 : 2}
                    mb={index === 0 ? 0 : 2}
                    mx={4}>
                    <HStack pb={1} mx={4}>
                      <View mx={4} my={2}>
                        <Text bold>{item?.name}</Text>
                        <Text>{`x ${item?.quantity} pcs`}</Text>
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
          </ScrollView>
        )}
        {detailOrderItems === null ? null : (
          <View
            position={'absolute'}
            alignSelf="center"
            bottom={'48'}
            flex={1}
            justifyContent="center"
            flexDirection={'row'}>
            <Button
              w={'45%'}
              isLoading={loading}
              isLoadingText="Loading"
              onPress={() => {
                orderReady();
                updateModal(false);
              }}
              mx={4}
              mb={4}
              borderRadius={10}
              bg={primaryColor?.primaryColor}>
              <Text color={'white'} bold>
                {t('order-ready')}
              </Text>
            </Button>
          </View>
        )}
      </View>
    </>
  );
};

export default DetailItem;
