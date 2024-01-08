import React, {useState, useEffect} from 'react';
import {View, Modal} from 'native-base';
import useOrders from '../../Hooks/useOrders';
import {useLoading} from '../../Context';
import {screenWidth} from '../../App';
import {RenderSkeletonKitchen} from './Components/KitchenLoading';
import KitchenHeader from './Components/Header';
import Search from '../../Components/Form/Search';
import OrderList from './Components/OrderList';
import DetailItem from './Components/DetailItem';
import {useTranslation} from 'react-i18next';

const TellerScreen: React.FC = () => {
  const skeletonItems = RenderSkeletonKitchen(screenWidth);
  const {loading} = useLoading();
  const {
    handleSearch,
    orders,
    newFetchData,
    handleRefresh,
    emptyData,
    orderReady,
  } = useOrders();
  const [modalVisible, setModalVisible] = useState(false);
  const {t} = useTranslation();
  const renderSkeletonItems = () => {
    return (
      <>
        {skeletonItems.map((item, index) => (
          <React.Fragment key={index}>{item}</React.Fragment>
        ))}
      </>
    );
  };

  const setDetailModal = (newValue: boolean) => {
    setModalVisible(newValue);
  };

  useEffect(() => {
    console.log('make');
  }, []);

  return (
    <>
      <KitchenHeader />
      <View mt={4} mx={5} py={1} px={1}>
        <Search
          search={text => {
            handleSearch(text);
          }}
          placeHolder={t('find-order')}
        />
      </View>

      {loading ? (
        <>{renderSkeletonItems()}</>
      ) : (
        <>
          <OrderList
            screenWidth={screenWidth}
            orders={orders}
            orderReady={orderReady}
            detailModal={modalVisible}
            handleRefresh={handleRefresh}
            newFetchData={newFetchData}
            emptyData={emptyData}
            setDetailModal={setDetailModal}
          />
        </>
      )}
      <Modal isOpen={modalVisible} onClose={setModalVisible} size={'full'}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>{t('detail')}</Modal.Header>
          <Modal.Body>{<DetailItem updateModal={setDetailModal} />}</Modal.Body>
        </Modal.Content>
      </Modal>
    </>
  );
};

export default TellerScreen;
