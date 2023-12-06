import {Badge, Divider, HStack, Image, Text, View} from 'native-base';
import React from 'react';
import FastImage from 'react-native-fast-image';
import noImage from '../../../Public/Assets/no-Image.jpg';
import formatDate from '../../../Components/Date/Date';
import RupiahFormatter from '../../../Components/Rupiah/Rupiah';
import {StyleSheet} from 'react-native';
import {OrderModel} from '../../../models/OrderModel';
import TabButton from './TabButton';

interface Props {
  item: OrderModel;
  filterName: string;
  activeTab: string;
  updateParentModal: (newValue: boolean) => void;
  updateConfirmParentModal: (newValue: boolean) => void;
}

const OrderItem: React.FC<Props> = ({
  item,
  filterName,
  activeTab,
  updateConfirmParentModal,
}) => {
  return (
    <>
      <View
        key={item?.id}
        mt={4}
        mx={4}
        borderRadius={10}
        borderTopColor={'gray.200'}
        bg={'white'}>
        <View my={4} flexDirection={'row'}>
          <Text mx={4} fontSize={'lg'} flex={10} color={'#848aac'} bold>
            {item?.order_code}
          </Text>
          <View justifyContent={'center'} alignItems={'center'} flex={2}>
            <Badge
              colorScheme="success"
              alignSelf="center"
              borderRadius={14}
              variant={'subtle'}>
              <Text bold color={'#2ebd53'}>
                {filterName}
              </Text>
            </Badge>
          </View>
        </View>
        <Divider />
        <View mx={4} mt={4} bg="white">
          <HStack mx={4}>
            <View>
              {item?.products[0]?.product?.photos.length !== 0 ? (
                <FastImage
                  style={styles.image}
                  source={{
                    uri: item?.products[0]?.product?.photos[0]?.original_url,
                    priority: FastImage.priority.normal,
                  }}
                  resizeMode={FastImage.resizeMode.contain}
                />
              ) : (
                <Image
                  source={noImage}
                  alt={'foto-produk'}
                  style={styles.image}
                  resizeMode="contain"
                />
              )}
            </View>
            <View mx={4} my={4}>
              <Text bold>{item?.products[0]?.name}</Text>
              <Text color={'#bfbfcf'}>{formatDate(item?.created_at)}</Text>
              <Text color={'#848aac'} bold>
                {`${
                  item?.products.length > 1
                    ? `+${item?.products?.length - 1} produk lainnya`
                    : ''
                }`}
              </Text>
            </View>
          </HStack>
          <Text bold mb={2} mt={2} mx={4}>
            {RupiahFormatter(item?.total)}
            <Text
              color={'#848aac'}>{` (${item?.products.length} Produk)`}</Text>
          </Text>
          {activeTab === 'Tab1' ? (
            <TabButton
              item={item}
              filterName={filterName}
              updateConfirmParentModal={updateConfirmParentModal}
            />
          ) : null}
        </View>
      </View>
    </>
  );
};

export default OrderItem;

const styles = StyleSheet.create({
  image: {
    width: 80,
    height: 80,
  },
});
