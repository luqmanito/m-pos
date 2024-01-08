import React, {FunctionComponent, useContext, useState} from 'react';
import {Button, FormControl, Input, Stack, Text} from 'native-base';
import NavBar from '../../Components/Navbar/Navbar';
import {useNavigation} from '@react-navigation/native';
import categoryNetwork from '../../Network/lib/categories';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {PrimaryColorContext} from '../../Context';
import {useDispatch, useSelector} from 'react-redux';
import {setCatalogueVisited} from '../../Redux/Reducers/isProductVisited';
import {RootState} from '../../Redux/store';
import useAlert from '../../Hooks/useAlert';
import {useTranslation} from 'react-i18next';

interface CategoryScreenProps {}

const AddCategoryScreen: FunctionComponent<CategoryScreenProps> = () => {
  const alert = useAlert();
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const [name, setName] = useState<string | undefined>('');
  const [description, setDescription] = useState<string | undefined>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigation = useNavigation();
  const isProductVisited = useSelector(
    (state: RootState) => state.isProductVisited,
  );
  const primaryColor = useContext(PrimaryColorContext);
  const postCategory = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await categoryNetwork.create({
        name: name,
        description: description,
      });
      if (response) {
        alert.showAlert('success', t('category-msg'));
        dispatch(setCatalogueVisited(!isProductVisited.catalogueVisited));
        setIsLoading(false);
        navigation.goBack();
      }
    } catch (error: any) {
      setIsLoading(false);
      alert.showAlert('error', error?.response?.data?.message);
      throw error;
    }
  };

  return (
    <>
      <NavBar msg={t('add-category')} />
      <FormControl isRequired>
        <Stack mx={4} mt={4}>
          <FormControl.Label>{t('category-name')}</FormControl.Label>
          <Input
            bg={'white'}
            borderRadius={10}
            onChangeText={text => setName(text)}
            type="text"
            maxLength={30}
            placeholder={t('category-placeholder')}
          />
        </Stack>
        <Stack mx={4} mt={4}>
          <FormControl.Label>{t('category-description')}</FormControl.Label>
          <Input
            bg={'white'}
            borderRadius={10}
            onChangeText={text => setDescription(text)}
            type="text"
            maxLength={30}
            placeholder={t('category-description-placeholder')}
          />
        </Stack>
      </FormControl>
      <Button
        isLoading={isLoading}
        borderRadius={34}
        isLoadingText="Loading"
        onPress={() => postCategory()}
        isDisabled={!name || !description ? true : false}
        w={'90%'}
        position={'absolute'}
        bottom={28}
        alignSelf="center"
        bg={primaryColor?.primaryColor}>
        <Text fontSize={'md'} color="white">
          <MaterialIcons name="save" size={15} color="white" /> {t('save')}
        </Text>
      </Button>
    </>
  );
};

export default AddCategoryScreen;
