import React, {useEffect, useState} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  useNavigation,
  NavigationProp,
  useIsFocused,
} from '@react-navigation/native';
import NetworkStatusHeader from '../../Components/Header/NetworkStatusHeader';
import Tabs from '../../Components/Tab/Tabs';
import FloatingButton from '../../Components/Button/FloatingButton';
import ListProduct from './ListProduct';
import ListCategory from './ListCategory';
import Container from '../../Components/Layout/Container';
import {useDispatch} from 'react-redux';
import {clearDataCamera} from '../../Redux/Reducers/upload';
import {useLoading} from '../../Context';

const CatalogueScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Tab1');

  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
  };

  const navigation = useNavigation<NavigationProp<any>>();
  const tabs = [
    {label: 'Produk', tab: 'Tab1'},
    {label: 'Kategori', tab: 'Tab2'},
  ];

  const add = () => {
    navigation.navigate(
      activeTab === 'Tab1' ? 'ProductDetail' : 'AddCategoryScreen',
      // activeTab === 'Tab1' ? 'AddProductScreen' : 'AddCategoryScreen',
    );
  };
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const {setLoading} = useLoading();
  useEffect(() => {
    if (isFocused) {
      setLoading(false);
      dispatch(clearDataCamera());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  return (
    <>
      <Container>
        <NetworkStatusHeader title={'Katalog'} />
        <Tabs tabs={tabs} onTabChange={value => handleTabPress(value)} />
        {activeTab === 'Tab1' ? <ListProduct /> : <ListCategory />}
      </Container>
      <FloatingButton
        onPress={add}
        label={activeTab === 'Tab1' ? 'Tambah Produk' : 'Tambah Kategori'}
        customIcon={<MaterialIcons name="add-circle" size={15} color="white" />}
      />
    </>
  );
};
export default CatalogueScreen;
