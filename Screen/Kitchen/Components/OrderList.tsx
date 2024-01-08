import React, {useState} from 'react';
import {View, Text, FlatList} from 'native-base';
import {useSelector} from 'react-redux';
import {RenderFooter} from '../../../Components/RenderFooter/RenderFooter';
import {OrderModel} from '../../../models/OrderModel';
import {RootState} from '../../../Redux/store';
import OrderItem from './OrderItem';
import {ListRenderItem} from 'react-native';
import DetailItem from './DetailItem';
import {MetaModel} from '../../../models/MetaModel';
import { useTranslation } from 'react-i18next';

interface ChildProps {
  setDetailModal: (newValue: boolean) => void;
  emptyData: boolean;
  detailModal: boolean;
  metaProduct: MetaModel;
  orders: OrderModel[];
  orderReady: () => void;
  handleRefresh: () => void;
  newFetchData: () => void;
  screenWidth: number;
}

const OrderList: React.FC<ChildProps> = ({
  setDetailModal,
  metaProduct,
  screenWidth,
  orders,
  newFetchData,
  handleRefresh,
  orderReady,
}) => {
  const [isSelected, setIsSelected] = useState<number | string>('');
  const {t} = useTranslation();
  const isLastPage = useSelector(
    (state: RootState) => state.buttonSlice.isLastPage,
  );
  const updateParentModal = (newValue: boolean) => {
    setDetailModal(newValue);
  };
  const updateSelected = (newValue: string | number) => {
    setIsSelected(newValue);
  };

  console.log(metaProduct?.current_page, metaProduct?.last_page);

  const renderItem: ListRenderItem<OrderModel> = ({item}) => (
    <>
      <OrderItem
        updateModal={updateParentModal}
        updateSelected={updateSelected}
        isSelected={isSelected}
        item={item}
      />
    </>
  );

  return (
    <>
      <View mx={6} my={4} flexDirection={'row'} minHeight={200}>
        <View
          pb={'40'}
          px={4}
          alignSelf={'center'}
          w={screenWidth > 600 ? '30%' : 'full'}>
          {orders?.length > 0 ? (
            <FlatList
              data={orders}
              renderItem={renderItem}
              keyExtractor={item => item?.id.toString()}
              ListFooterComponent={!isLastPage ? <RenderFooter /> : null}
              onRefresh={handleRefresh}
              refreshing={false}
              onEndReached={newFetchData}
              onEndReachedThreshold={0.5}
            />
          ) : (
            <View mt={12} justifyContent={'center'} alignItems={'center'}>
              <Text bold> {t('no-data-found')}</Text>
            </View>
          )}
        </View>
        {screenWidth > 600 ? (
          <DetailItem orderReady={orderReady} updateModal={updateParentModal} />
        ) : null}
      </View>
    </>
  );
};

export default OrderList;
