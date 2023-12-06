import React, {useState, useCallback, useContext} from 'react';
import {View} from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useFocusEffect} from '@react-navigation/native';
import {clearStateProduct} from '../../Redux/Reducers/product';
import {useDispatch} from 'react-redux';
import {clearDataCamera} from '../../Redux/Reducers/upload';
import {clearCart} from '../../Redux/Reducers/cart';
import {PrimaryColorContext} from '../../Context';
import NetworkStatusHeader from '../../Components/Header/NetworkStatusHeader';
import ReusableButton from '../../Components/Button/ReusableButton';
import ProductList from './ListProduct';
import ShoppingCartSummary from './components/ShoppingCartSummary';
import CategoryModal from './components/CategoryModal';

export const CashierScreen: React.FC = () => {
  const primaryColor = useContext(PrimaryColorContext);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = React.useState(0);
  const dispatch = useDispatch();

  const updateParentState = (newValue: boolean) => {
    setIsOpen(newValue);
  };
  const handleCategory = (newValue: number) => {
    setSelectedCategories(newValue);
  };

  useFocusEffect(
    useCallback(() => {
      dispatch(clearStateProduct());
      dispatch(clearDataCamera());
    }, [dispatch]),
  );

  return (
    <>
      <View ml={4} position={'relative'}>
        <NetworkStatusHeader title={'Kasir'} />
        <View
          position={'absolute'}
          right={0}
          mr={4}
          mt={4}
          alignSelf={'center'}>
          <ReusableButton
            onPress={() => {
              dispatch(clearCart());
            }}>
            <MaterialIcons name="clear" color={primaryColor?.primaryColor} />
            Reset
          </ReusableButton>
        </View>
      </View>
      <ProductList
        updateParentState={updateParentState}
        selectedCategories={selectedCategories}
      />
      <ShoppingCartSummary />
      <CategoryModal
        handleCategoryState={handleCategory}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};
