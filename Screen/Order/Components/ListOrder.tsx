import {
  Center,
  Icon,
  Image,
  FlatList,
  Pressable,
  Input,
  Text,
  View,
} from 'native-base';
import React, {useContext, useState} from 'react';
import shop from '../../../Public/Assets/shop.png';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {PrimaryColorContext, useLoading} from '../../../Context';
import {skeletonItems} from '../../Kitchen/Components/KitchenLoading';
import useOrders from '../../../Hooks/useOrders';
import {useSelector} from 'react-redux';
import {RootState} from '../../../Redux/store';
import LoaderFooter from '../../../Components/Footer/LoaderFooter';
import Search from '../../../Components/Form/Search';
import useUserInfo from '../../../Hooks/useUserInfo';
import Tabs from '../../../Components/Tab/Tabs';
import OrderItem from './OrderItem';
import {ListRenderItem} from 'react-native';
import {OrderModel} from '../../../models/OrderModel';
import Empty from '../../../Components/Content/Empty';

interface ChildProps {
  updateParentModal: (newValue: boolean) => void;
  updateFilter: (newValue: string) => void;
  filterName: string;
  updateConfirmParentModal: (newValue: boolean) => void;
}

const ListOrder: React.FC<ChildProps> = ({
  updateParentModal,
  updateFilter,
  filterName,
  updateConfirmParentModal,
}) => {
  const {onlineModule} = useUserInfo();
  const {loading} = useLoading();
  const [activeTab, setActiveTab] = useState('Tab1');
  const primaryColor = useContext(PrimaryColorContext);
  const [searchResults, setSearchResults] = useState('');
  const orderItems = useSelector((state: RootState) => state.orderSlice.orders);
  const {
    orders,
    newFetchData,
    handleRefresh,
    fetchOrdersByStatus,
    handleSearch,
  } = useOrders();
  const renderSkeletonItems = () => {
    return (
      <>
        {skeletonItems.map((item, index) => (
          <React.Fragment key={index}>{item}</React.Fragment>
        ))}
      </>
    );
  };

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

  const tabs = [
    onlineModule
      ? {label: 'Online', tab: 'Tab1'}
      : {label: 'Online', tab: 'Tab1'},
    {label: 'Offline', tab: 'Tab2'},
  ];

  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
    tabName === 'Tab1'
      ? (fetchOrdersByStatus('pending', 'ONLINE'), updateFilter('Pending'))
      : fetchOrdersByStatus('confirm', 'OFFLINE');
  };

  return (
    <>
      <Search
        search={text => {
          handleSearch(text);
          setSearchResults(text);
        }}
      />
      <View flexDirection={'row'}>
        <Tabs tabs={tabs} onTabChange={value => handleTabPress(value)} />
      </View>
      {loading ? (
        <>{renderSkeletonItems()}</>
      ) : activeTab === 'Tab1' ? (
        <>
          <View mt={4}>
            <View p={2} mx={4} flexDirection={'row'}>
              <View alignItems={'flex-end'} flex={2}>
                <Center borderRadius={20}>
                  <Pressable onPress={() => updateParentModal(true)}>
                    <Input
                      bg={'white'}
                      w={'100%'}
                      borderRadius={10}
                      borderWidth="0"
                      py="1"
                      px="1"
                      isReadOnly={true}
                      variant={'filled'}
                      type="text"
                      placeholder="Pilih Kategori"
                      value={filterName ? filterName : 'Pending'}
                      InputRightElement={
                        <Icon
                          as={<AntDesign name={'down'} />}
                          size={4}
                          mr="2"
                          color={primaryColor?.primaryColor}
                        />
                      }
                      InputLeftElement={
                        <Icon
                          as={<FontAwesome name={'filter'} />}
                          size={4}
                          ml="2"
                          color={primaryColor?.primaryColor}
                        />
                      }
                    />
                  </Pressable>
                </Center>
              </View>
            </View>
          </View>
          {orders.length > 0 ? (
            <FlatList
              key={'order-list'}
              data={orderItems}
              renderItem={renderItem}
              keyExtractor={item => item.id.toString()}
              ListFooterComponent={<LoaderFooter />}
              onRefresh={handleRefresh}
              refreshing={false}
              onEndReached={newFetchData}
              onEndReachedThreshold={10}
            />
          ) : orders.length === 0 && searchResults ? (
            <View mt={12} justifyContent={'center'} alignItems={'center'}>
              <Text bold> Tidak Ada Data Ditemukan</Text>
            </View>
          ) : (
            <View mt={12} justifyContent={'center'} alignItems={'center'}>
              <Image
                source={shop}
                alt={'logo-pemkab'}
                w={'80%'}
                resizeMode="contain"
              />
              <Empty
                title={'Belum ada pesanan baru !'}
                showIMage={true}
                subtitle={
                  'Semua pesanan yang sedang berjalan akan tampil disini'
                }
              />
            </View>
          )}
        </>
      ) : (
        <>
          {orders.length > 0 ? (
            <FlatList
              data={orders}
              renderItem={renderItem}
              keyExtractor={item => item?.id.toString()}
              ListFooterComponent={<LoaderFooter />}
              onRefresh={handleRefresh}
              refreshing={false}
              onEndReached={newFetchData}
              onEndReachedThreshold={10}
            />
          ) : orders.length === 0 && searchResults ? (
            <View mt={12} justifyContent={'center'} alignItems={'center'}>
              <Text bold> Tidak Ada Data Ditemukan</Text>
            </View>
          ) : (
            <View mt={12} justifyContent={'center'} alignItems={'center'}>
              <Image
                source={shop}
                alt={'logo-pemkab'}
                w={'80%'}
                resizeMode="contain"
              />
              <Empty
                title={'Belum ada pesanan baru !'}
                showIMage={true}
                subtitle={
                  'Semua pesanan yang sedang berjalan akan tampil disini'
                }
              />
            </View>
          )}
        </>
      )}
    </>
  );
};

export default ListOrder;
