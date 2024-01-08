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
import {useDispatch} from 'react-redux';
import {clearDataCamera} from '../../Redux/Reducers/upload';
import {useLoading} from '../../Context';
import ContainerNav from '../../Components/Layout/ContainerNav';
import {useTranslation} from 'react-i18next';

const CatalogueScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Tab1');
  const {t} = useTranslation();
  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
  };

  const navigation = useNavigation<NavigationProp<any>>();
  const tabs = [
    {label: t('product'), tab: 'Tab1'},
    {label: t('category'), tab: 'Tab2'},
  ];

  const add = () => {
    navigation.navigate(
      activeTab === 'Tab1' ? 'ProductDetail' : 'AddCategoryScreen',
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
      <ContainerNav>
        <NetworkStatusHeader title={t('catalogue')} />
        <Tabs tabs={tabs} onTabChange={value => handleTabPress(value)} />
        {activeTab === 'Tab1' ? <ListProduct /> : <ListCategory />}
      </ContainerNav>
      <FloatingButton
        onPress={add}
        label={activeTab === 'Tab1' ? t('add-product') : t('add-category')}
        customIcon={<MaterialIcons name="add-circle" size={15} color="white" />}
      />
    </>
  );
};
export default CatalogueScreen;
