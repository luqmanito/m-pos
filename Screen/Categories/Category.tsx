import React, {FunctionComponent, useContext, useEffect, useState} from 'react';
import {Button, HStack, Radio, Text, View} from 'native-base';
import NavBar from '../../Components/Navbar/Navbar';
import {useNavigation} from '@react-navigation/native';
import productNetwork from '../../Network/lib/product';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';
import {setCategoryCode, setCategoryName} from '../../Redux/Reducers/product';
import {Pressable} from 'react-native';
import {RootState} from '../../Redux/store';
import {CategoryModel, RootCategoryModel} from '../../models/CategoryModel';
import {PrimaryColorContext} from '../../Context';

interface CategoryScreenProps {}

const CategoryScreen: FunctionComponent<CategoryScreenProps> = () => {
  const [value, setValue] = useState<string | undefined>('');
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const categoryCode = useSelector(
    (state: RootState) => state.productSlice?.categoryCode,
  );
  const primaryColor = useContext(PrimaryColorContext);
  const fetchProducts = async (): Promise<RootCategoryModel> => {
    try {
      const response = await productNetwork.categoryList({
        page: 1,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchProducts();
        const categoryList = response.data;
        setCategories(categoryList);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <NavBar msg={'Pilih Kategori'} />
      {categories.map(category => {
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
              mx={4}
              mt={4}>
              <View justifyContent={'center'} h={10} flex={10}>
                <Text ml={2}>{category?.name}</Text>
              </View>
              <View justifyContent={'center'} flex={1}>
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
      })}
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
          <MaterialIcons name="save" size={15} color="white" /> Simpan Kategori
        </Text>
      </Button>
    </>
  );
};

export default CategoryScreen;
