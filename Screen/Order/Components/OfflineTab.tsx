import {Text, FlatList, View} from 'native-base';
import React from 'react';
import Empty from '../../../Components/Content/Empty';
import {OrderModel} from '../../../models/OrderModel';
import {ListRenderItem} from 'react-native';
import OrderItem from './OrderItem';
import LoaderFooter from '../../../Components/Footer/LoaderFooter';
import {RootState} from '../../../Redux/store';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';

interface Props {
  updateParentModal: (newValue: boolean) => void;
  filterName: string;
  searchResults: string;
  activeTab: string;
  orders: OrderModel[];
  handleRefresh: () => void;
  newFetchData: () => void;
  updateConfirmParentModal: (newValue: boolean) => void;
}

const OfflineTab: React.FC<Props> = ({
  updateParentModal,
  activeTab,
  orders,
  searchResults,
  handleRefresh,
  newFetchData,
  updateConfirmParentModal,
  filterName,
}) => {
  const {t} = useTranslation();
  const renderItem: ListRenderItem<OrderModel> = ({item}) => (
    <>
      <OrderItem
        filterName={filterName}
        activeTab={activeTab}
        updateParentModal={updateParentModal}
        updateConfirmParentModal={updateConfirmParentModal}
        item={item}
      />
    </>
  );
  const isLastPage = useSelector(
    (state: RootState) => state.buttonSlice.isLastPage,
  );
  return (
    <>
      {orders.length > 0 ? (
        <FlatList
          data={orders}
          renderItem={renderItem}
          keyExtractor={item => item?.id.toString()}
          ListFooterComponent={!isLastPage ? <LoaderFooter /> : null}
          onRefresh={handleRefresh}
          refreshing={false}
          onEndReached={newFetchData}
          onEndReachedThreshold={0.5}
        />
      ) : orders.length === 0 && searchResults ? (
        <View mt={12} justifyContent={'center'} alignItems={'center'}>
          <Text bold> {t('no-data-found')} </Text>
        </View>
      ) : (
        <View mt={12} justifyContent={'center'} alignItems={'center'}>
          <Empty
            title={t('empty-order')}
            showIMage={false}
            subtitle={t('all-order')}
          />
        </View>
      )}
    </>
  );
};

export default OfflineTab;
