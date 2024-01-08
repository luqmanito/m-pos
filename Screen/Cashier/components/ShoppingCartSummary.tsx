import React, {useContext} from 'react';
import {Pressable, View, Text, Center, PresenceTransition} from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {PrimaryColorContext} from '../../../Context';
import {useSelector} from 'react-redux';
import {RootState} from '../../../Redux/store';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import currencyFormatter from '../../../Util/Rupiah/Rupiah';

interface ShoppingCartSummaryProps {
  color?: string;
}

const ShoppingCartSummary: React.FC<ShoppingCartSummaryProps> = ({color}) => {
  const primaryColor = useContext(PrimaryColorContext);
  const navigation = useNavigation<NavigationProp<any>>();
  const {t} = useTranslation();
  const cartItems = useSelector((state: RootState) => state.cartSlice.items);
  const totalSum = cartItems.reduce((sum, item) => sum + item.subTotal, 0);
  const filteredItems = cartItems.filter(item => item.quantity > 0);
  if (totalSum === 0) {
    return null;
  }

  return (
    <Pressable
      onPress={() => {
        navigation.navigate('CheckoutScreen');
      }}>
      <PresenceTransition
        visible={totalSum === 0 ? false : true}
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
          transition: {
            duration: 250,
          },
        }}>
        <View
          borderRadius={34}
          p={2}
          w={'90%'}
          position={'absolute'}
          alignSelf="center"
          bottom={18}
          flexDirection={'row'}
          bg={color || primaryColor?.primaryColor}>
          <Text ml={4} color="white" flex={2}>
            {filteredItems.length + ` ${t('product')}`}
          </Text>
          <Center mx={2}>
            <Text flex={1} fontSize={'md'} color="white">
              {currencyFormatter(totalSum)}
            </Text>
          </Center>
          <MaterialIcons
            name="shopping-cart"
            style={styles.iconCart}
            size={15}
            color="white"
          />
        </View>
      </PresenceTransition>
    </Pressable>
  );
};

export default ShoppingCartSummary;

const styles = {
  iconCart: {
    marginTop: 4,
    marginRight: 5,
  },
};
