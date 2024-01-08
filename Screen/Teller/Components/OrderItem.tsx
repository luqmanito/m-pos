import {
  Badge,
  Button,
  Divider,
  HStack,
  Pressable,
  Text,
  View,
} from 'native-base';
import React, {useContext} from 'react';
import {useTranslation} from 'react-i18next';
import {useDispatch} from 'react-redux';
import {screenWidth} from '../../../App';
import {PrimaryColorContext, useLoading} from '../../../Context';
import {OrderModel} from '../../../models/OrderModel';
import {setActiveId} from '../../../Redux/Reducers/button';
import formatDate from '../../../Util/Date/Date';

interface Props {
  item: OrderModel;
  isSelected: number | string;
  updateSelected: (newValue: string | number) => void;
  updateModal: (newValue: boolean) => void;
}

const OrderItem: React.FC<Props> = ({
  item,
  isSelected,
  updateSelected,
  updateModal,
}) => {
  const primaryColor = useContext(PrimaryColorContext);
  const dispatch = useDispatch();
  const {loading} = useLoading();
  const {t} = useTranslation();
  return (
    <Pressable
      w="100%"
      onPress={() => {
        dispatch(setActiveId(item?.id));
        screenWidth > 600 ? null : updateModal(true);
        updateSelected(item?.id);
      }}
      key={item?.id}
      my={4}
      borderRadius={10}
      borderTopColor={'gray.200'}
      bg={isSelected === item.id ? primaryColor?.secondaryColor : 'white'}>
      <View my={4} flexDirection={'row'}>
        <Text mx={4} fontSize={'lg'} flex={2} color={'#848aac'} bold>
          {item?.order_code}
        </Text>
        <View justifyContent={'center'} alignItems={'center'} flex={1}>
          <Badge
            colorScheme="success"
            alignSelf="center"
            borderRadius={14}
            variant={'subtle'}>
            <Text bold color={'#2ebd53'}>
              {item?.status}
            </Text>
          </Badge>
        </View>
      </View>
      <Divider />
      <View
        mx={4}
        mt={4}
        bg={isSelected === item.id ? primaryColor?.secondaryColor : 'white'}>
        <HStack mx={4}>
          <View mx={4} mb={4}>
            <Text bold fontSize={'lg'}>
              {item?.products[0]?.name}
            </Text>
            <Text color={'#bfbfcf'}>{formatDate(item?.created_at)}</Text>
            <Text color={'#848aac'} bold>
              {`${
                item?.products.length > 1
                  ? `+${item?.products?.length - 1} ${t('other-product')}`
                  : ''
              }`}
            </Text>
          </View>
        </HStack>
        <Button
          onPress={() => {
            dispatch(setActiveId(item?.id));
            screenWidth > 600 ? null : updateModal(true);
            updateSelected(item?.id);
          }}
          mt={2}
          isLoading={loading}
          isLoadingText={'loading..'}
          mb={4}
          borderRadius={20}
          bg={primaryColor?.primaryColor}>
          <Text color={'white'} bold>
            {t('see-detail')}
          </Text>
        </Button>
      </View>
    </Pressable>
  );
};

export default OrderItem;
