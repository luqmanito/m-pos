import React, {FunctionComponent, useContext, useState} from 'react';
import {Button, HStack, Radio, Text, View} from 'native-base';
import NavBar from '../../Components/Navbar/Navbar';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';
import {setCategoryCode, setCategoryName} from '../../Redux/Reducers/product';
import {Pressable} from 'react-native';
import {RootState} from '../../Redux/store';
import {PrimaryColorContext, useLoading} from '../../Context';
import useCategories from '../../Hooks/useCategory';
import {useTranslation} from 'react-i18next';

interface CategoryScreenProps {}

const CategoryScreen: FunctionComponent<CategoryScreenProps> = () => {
  const [value, setValue] = useState<string | undefined>('');
  const {t} = useTranslation();
  const {categories} = useCategories();
  const {loading} = useLoading();
  const navigation = useNavigation<NavigationProp<any>>();
  const dispatch = useDispatch();
  const categoryCode = useSelector(
    (state: RootState) => state.productSlice?.categoryCode,
  );
  const primaryColor = useContext(PrimaryColorContext);
  return (
    <>
      <NavBar msg={t('set-category')} />
      {loading ? (
        <View mt={12} justifyContent={'center'} alignItems={'center'}>
          <Text bold fontSize={'xl'}>
            Loading...
          </Text>
        </View>
      ) : categories.length === 0 && !loading ? (
        <View mt={12} justifyContent={'center'} alignItems={'center'}>
          <Text bold> {t('no-category')}</Text>
          <Button
            bg={primaryColor?.primaryColor}
            onPress={() => {
              navigation.navigate('AddCategoryScreen');
            }}
            mt={4}>
            {t('add-category')}
          </Button>
        </View>
      ) : (
        categories.map(category => {
          return (
            <Pressable
              key={category?.id}
              onPress={() => {
                setValue(category?.id.toString());
                dispatch(setCategoryCode(category?.id));
                dispatch(setCategoryName(category?.name));
              }}>
              <HStack
                key={category?.id}
                bg={'white'}
                borderRadius={10}
                flexDirection={'row'}
                mx={4}
                mt={4}>
                <View justifyContent={'center'} h={10} flex={1}>
                  <Text ml={2}>{category?.name}</Text>
                </View>
                <View
                  justifyContent={'center'}
                  alignItems={'flex-end'}
                  mr={2}
                  flex={1}>
                  <Radio.Group
                    name="myRadioGroup"
                    accessibilityLabel="favorite number"
                    value={`${categoryCode}`}
                    onChange={nextValue => {
                      setValue(nextValue);
                      dispatch(setCategoryCode(category?.id));
                      dispatch(setCategoryName(category?.name));
                    }}>
                    <Radio value={category?.id.toString()} my={1}>
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
        onPress={() => navigation.goBack()}
        isDisabled={!value ? true : false}
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

export default CategoryScreen;
