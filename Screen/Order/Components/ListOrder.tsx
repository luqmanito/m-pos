import {View} from 'native-base';
import React, {useState} from 'react';
import {useLoading} from '../../../Context';
import {skeletonItems} from '../../Kitchen/Components/KitchenLoading';
import useOrders from '../../../Hooks/useOrders';
import Search from '../../../Components/Form/Search';
import useUserInfo from '../../../Hooks/useUserInfo';
import Tabs from '../../../Components/Tab/Tabs';
import OnlineTab from './OnlineTab';
import OfflineTab from './OfflineTab';

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
  const [searchResults, setSearchResults] = useState('');
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
        <OnlineTab
          updateConfirmParentModal={updateConfirmParentModal}
          updateParentModal={updateParentModal}
          filterName={filterName}
          searchResults={searchResults}
          activeTab={activeTab}
          orders={orders}
          handleRefresh={handleRefresh}
          newFetchData={newFetchData}
        />
      ) : (
        <OfflineTab
          updateConfirmParentModal={updateConfirmParentModal}
          updateParentModal={updateParentModal}
          filterName={filterName}
          searchResults={searchResults}
          activeTab={activeTab}
          orders={orders}
          handleRefresh={handleRefresh}
          newFetchData={newFetchData}
        />
      )}
    </>
  );
};

export default ListOrder;
