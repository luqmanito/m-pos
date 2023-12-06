import React, {useState, useCallback} from 'react';
import {View} from 'native-base';
import {useFocusEffect} from '@react-navigation/native';
import {clearStateProduct} from '../../Redux/Reducers/product';
import {useDispatch} from 'react-redux';
import {clearDataCamera} from '../../Redux/Reducers/upload';
import NetworkStatusHeader from '../../Components/Header/NetworkStatusHeader';
import ListOrder from './Components/ListOrder';
import OrderModal from './Components/OrderModal';

export const OrderScreen: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenConfirm, setIsOpenConfirm] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('Pending');
  const dispatch = useDispatch();
  useFocusEffect(
    useCallback(() => {
      dispatch(clearStateProduct());
      dispatch(clearDataCamera());
    }, [dispatch]),
  );

  const updateParentModal = (newValue: boolean) => {
    setIsOpen(newValue);
  };
  const updateParentConfirmModal = (newValue: boolean) => {
    setIsOpenConfirm(newValue);
  };
  const updateStatusParent = (newValue: string) => {
    setSelectedFilter(newValue);
  };

  return (
    <>
      <View mx={4} flex={1}>
        <NetworkStatusHeader title={'Pesanan'} />
        <ListOrder
          filterName={selectedFilter}
          updateFilter={updateStatusParent}
          updateConfirmParentModal={updateParentConfirmModal}
          updateParentModal={updateParentModal}
        />
        <OrderModal
          confirmModal={isOpenConfirm}
          onCloseConfirm={() => setIsOpenConfirm(false)}
          selectedFilter={selectedFilter}
          updateStatusParent={updateStatusParent}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      </View>
    </>
  );
};
