import {Text, FlatList, Icon, View, Pressable} from 'native-base';
import React, {useContext} from 'react';
import Empty from '../../../Components/Content/Empty';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {PrimaryColorContext} from '../../../Context';
import {OrderModel} from '../../../models/OrderModel';
import {useSelector} from 'react-redux';
import {RootState} from '../../../Redux/store';
import {ListRenderItem} from 'react-native';
import OrderItem from './OrderItem';
import LoaderFooter from '../../../Components/Footer/LoaderFooter';
import BaseInput from '../../../Components/Form/BaseInput';
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

const OnlineTab: React.FC<Props> = ({
  updateParentModal,
  activeTab,
  orders,
  searchResults,
  handleRefresh,
  newFetchData,
  updateConfirmParentModal,
  filterName,
}) => {
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
  const {t} = useTranslation();
  const orderItems = useSelector((state: RootState) => state.orderSlice.orders);
  const primaryColor = useContext(PrimaryColorContext);
  const isLastPage = useSelector(
    (state: RootState) => state.buttonSlice.isLastPage,
  );
  return (
    <>
      <View px={4}>
        <Pressable onPress={() => updateParentModal(true)}>
          <BaseInput
            inputKey={'category'}
            isReadOnly={true}
            bg={'white'}
            borderRadius={10}
            label={'Kategori'}
            defaultValue={filterName ? filterName : 'Pending'}
            placeholder={'Pilih Kategori'}
            rightIcon={
              <Icon
                as={<AntDesign name={'down'} />}
                size={4}
                mr="2"
                color={primaryColor?.primaryColor}
              />
            }
            leftIcon={
              <Icon
                as={<FontAwesome name={'filter'} />}
                size={4}
                ml="2"
                color={primaryColor?.primaryColor}
              />
            }
          />
        </Pressable>
      </View>

      {orders.length > 0 ? (
        <FlatList
          key={'order-list'}
          data={orderItems}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          ListFooterComponent={!isLastPage ? <LoaderFooter /> : null}
          onRefresh={handleRefresh}
          refreshing={false}
          onEndReached={newFetchData}
          onEndReachedThreshold={0.5}
        />
      ) : orders.length === 0 && searchResults ? (
        <View mt={12} justifyContent={'center'} alignItems={'center'}>
          <Text bold> {t('no-data-found')}</Text>
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

export default OnlineTab;
