import React, {useState} from 'react';
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

const KitchenScreen: React.FC = () => {
  const skeletonItems = RenderSkeletonKitchen(screenWidth);
  const {loading} = useLoading();
  const {
    handleSearch,
    orders,
    metaProduct,
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

  return (
    <>
      <KitchenHeader />
      <View mt={4} mx={5} py={1} px={1}>
        <Search
          search={text => {
            handleSearch(text);
          }}
          placeHolder="Cari Pesanan"
        />
      </View>

      {loading ? (
        <>{renderSkeletonItems()}</>
      ) : (
        <>
          <OrderList
            screenWidth={screenWidth}
            orders={orders}
            metaProduct={metaProduct}
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
          <Modal.Body>
            {
              <DetailItem
                updateModal={setDetailModal}
                orderReady={orderReady}
              />
            }
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </>
  );
};

export default KitchenScreen;
