import React, {FunctionComponent} from 'react';
import {Button, HStack, Radio, Text, View} from 'native-base';
import NavBar from '../../Components/Navbar/Navbar';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import {Pressable, StyleSheet} from 'react-native';
import {RootState} from '../../Redux/store';
import usePaymentMethod from '../../Hooks/usePaymentMethod';
import {
  setPaymentMethod,
  setPaymentMethodId,
} from '../../Redux/Reducers/button';

interface CategoryScreenProps {
  navigation: any;
}

const PaymentMethodScreen: FunctionComponent<CategoryScreenProps> = ({
  navigation,
}) => {
  const dispatch = useDispatch();
  const {paymentMethod} = usePaymentMethod();
  const filteredData = paymentMethod.filter(item => item.pivot.status === 1);
  const paymentMethodCode = useSelector(
    (state: RootState) => state.buttonSlice?.payment_methodId,
  );

  return (
    <>
      <NavBar msg={'Metode Pembayaran'} />
      {filteredData?.map(payment => {
        return (
          <Pressable
            key={payment?.id}
            onPress={() => {
              dispatch(setPaymentMethodId(payment?.id));
              dispatch(setPaymentMethod(payment?.name));
            }}>
            <HStack
              key={payment?.id}
              bg={'white'}
              borderRadius={10}
              mx={4}
              mt={4}>
              <View justifyContent={'center'} h={10} flex={10}>
                <View flexDirection={'row'}>
                  <View>
                    <Ionicons
                      style={styles.icon}
                      name={payment?.id === 1 ? 'cash' : 'card'}
                      size={20}
                      color="#8288b3"
                    />
                  </View>
                  <View>
                    <Text ml={2}>{payment?.name}</Text>
                  </View>
                </View>
              </View>
              <View
                mr={4}
                alignItems={'flex-end'}
                justifyContent={'center'}
                flex={1}>
                <Radio.Group
                  name="myRadioGroup"
                  accessibilityLabel="favorite number"
                  value={`${paymentMethodCode}`}
                  onChange={() => {
                    dispatch(setPaymentMethodId(payment?.id));
                    dispatch(setPaymentMethod(payment?.name));
                  }}>
                  <Radio value={payment?.id.toString()} my={1}>
                    {''}
                  </Radio>
                </Radio.Group>
              </View>
            </HStack>
          </Pressable>
        );
      })}
      <Button
        borderRadius={34}
        onPress={() => navigation.navigate('PaymentScreen')}
        isDisabled={!paymentMethodCode ? true : false}
        w={'90%'}
        position={'absolute'}
        bottom={28}
        alignSelf="center"
        bg={'#0c50ef'}>
        <Text fontSize={'md'} color="white">
          <MaterialIcons name="save" size={15} color="white" /> Pilih Pembayaran
        </Text>
      </Button>
    </>
  );
};

export default PaymentMethodScreen;

const styles = StyleSheet.create({
  icon: {
    marginLeft: 4,
  },
});
