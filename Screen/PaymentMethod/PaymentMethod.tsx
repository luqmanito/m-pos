import React, {FunctionComponent, useContext} from 'react';
import {Button, HStack, Radio, Text, View} from 'native-base';
import NavBar from '../../Components/Navbar/Navbar';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import {Pressable, StyleSheet} from 'react-native';
import {RootState} from '../../Redux/store';
import {
  setPaymentMethod,
  setPaymentMethodId,
} from '../../Redux/Reducers/button';
import {PrimaryColorContext} from '../../Context';
import usePaymentMethod from '../../Hooks/usePaymentMethod';
import {useTranslation} from 'react-i18next';

interface CategoryScreenProps {
  navigation: any;
}

const PaymentMethodScreen: FunctionComponent<CategoryScreenProps> = ({
  navigation,
}) => {
  const dispatch = useDispatch();
  const {paymentMethod} = usePaymentMethod();
  const paymentMethodCode = useSelector(
    (state: RootState) => state.buttonSlice?.payment_methodId,
  );
  const {t} = useTranslation();
  const primaryColor = useContext(PrimaryColorContext);
  return (
    <>
      <NavBar msg={t('payment-method')} />
      {paymentMethod.length === 0 ? (
        <Pressable
          onPress={() => {
            dispatch(setPaymentMethodId(1));
            dispatch(setPaymentMethod('CASH'));
          }}>
          <HStack bg={'white'} borderRadius={10} mx={4} mt={4}>
            <View justifyContent={'center'} h={10} flex={10}>
              <View flexDirection={'row'}>
                <View>
                  <Ionicons
                    style={styles.icon}
                    name={'cash'}
                    size={20}
                    color="#8288b3"
                  />
                </View>
                <View>
                  <Text ml={2}>{'CASH'}</Text>
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
                value={'1'}
                onChange={() => {
                  dispatch(setPaymentMethodId(1));
                  dispatch(setPaymentMethod('CASH'));
                }}>
                <Radio value={'1'} my={1}>
                  {''}
                </Radio>
              </Radio.Group>
            </View>
          </HStack>
        </Pressable>
      ) : (
        paymentMethod?.map(payment => {
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
        })
      )}
      <Button
        borderRadius={34}
        onPress={() => navigation.navigate('PaymentScreen')}
        isDisabled={!paymentMethodCode ? true : false}
        w={'90%'}
        position={'absolute'}
        bottom={28}
        alignSelf="center"
        bg={primaryColor?.primaryColor}>
        <Text fontSize={'md'} color="white">
          <MaterialIcons name="save" size={15} color="white" />{' '}
          {t('select-payment')}
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
