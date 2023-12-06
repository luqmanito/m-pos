import {Button, Text, View} from 'native-base';
import React, {useContext} from 'react';
import {useDispatch} from 'react-redux';
import {clearCart, updateCartItemQuantity} from '../../../Redux/Reducers/cart';
import {
  setActiveId,
  setCustomerName,
  setSelectedId,
  setTableNumber,
} from '../../../Redux/Reducers/button';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {PrimaryColorContext} from '../../../Context';
import {OrderModel} from '../../../models/OrderModel';

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
  const primaryColor = useContext(PrimaryColorContext);
  const dispatch = useDispatch();

  return (
    <>
      <View flex={1} justifyContent={'space-evenly'} flexDirection={'row'}>
        <Button
          w={'45%'}
          isDisabled={filterName === 'Confirm'}
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
          mt={2}
          mb={4}
          borderRadius={20}
          bg={primaryColor?.primaryColor}>
          <Text color={'white'} bold>
            Edit Order
          </Text>
        </Button>
        <Button
          bg={primaryColor?.secondaryColor}
          onPress={() => {
            updateConfirmParentModal(true);
            dispatch(setActiveId(item?.id));
            dispatch(setSelectedId(item?.id));
          }}
          mt={2}
          mb={4}
          borderRadius={20}
          w={'45%'}>
          <Text bold>Konfirmasi Order</Text>
        </Button>
      </View>
    </>
  );
};

export default TabButton;
