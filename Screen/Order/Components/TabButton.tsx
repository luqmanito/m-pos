import {View} from 'native-base';
import React from 'react';
import {useDispatch} from 'react-redux';
import {clearCart, updateCartItemQuantity} from '../../../Redux/Reducers/cart';
import {
  setActiveId,
  setCustomerName,
  setSelectedId,
  setTableNumber,
} from '../../../Redux/Reducers/button';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {OrderModel} from '../../../models/OrderModel';
import BaseButton from '../../../Components/Button/BaseButton';
import {useTranslation} from 'react-i18next';

interface Props {
  item: OrderModel;
  filterName: string;
  updateConfirmParentModal: (newValue: boolean) => void;
}

const TabButton: React.FC<Props> = ({
  item,
  filterName,
  updateConfirmParentModal,
}) => {
  const navigation = useNavigation<NavigationProp<any>>();
  const dispatch = useDispatch();
  const {t} = useTranslation();
  return (
    <>
      <View flex={1} justifyContent={'space-evenly'} flexDirection={'row'}>
        <View w={'45%'} mt={2} mb={4}>
          <BaseButton
            onPress={() => {
              navigation.navigate('EditOrderScreen');
              dispatch(clearCart());
              dispatch(setTableNumber(item?.table_no));
              dispatch(setCustomerName(item?.customer_name));
              item?.products.map(listOrder => {
                dispatch(
                  updateCartItemQuantity({
                    productId: listOrder?.product_id,
                    quantity: listOrder?.quantity,
                    subTotal: listOrder?.quantity * listOrder?.price,
                    name: listOrder?.name,
                    photos: listOrder?.product?.photos[0]?.original_url,
                    basePrice: listOrder?.price,
                    note: listOrder?.note,
                  }),
                );
              });
              dispatch(setSelectedId(item?.id));
            }}
            bold={true}
            type="primary"
            label={t('edit-order')}
            borderRadius={20}
            isDisabled={filterName === 'Confirm'}
          />
        </View>
        <View w={'45%'} mt={2} mb={4}>
          <BaseButton
            onPress={() => {
              updateConfirmParentModal(true);
              dispatch(setActiveId(item?.id));
              dispatch(setSelectedId(item?.id));
            }}
            textColor={'black'}
            bold={true}
            type="secondary"
            label={t('confirm')}
            borderRadius={20}
          />
        </View>
      </View>
    </>
  );
};

export default TabButton;
