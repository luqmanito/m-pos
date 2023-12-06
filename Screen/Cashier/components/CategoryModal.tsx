// CategoryModal.tsx
import React, {useContext, useState} from 'react';
import {
  Modal,
  Pressable,
  View,
  Text,
  Divider,
  Button,
  Center,
} from 'native-base';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {PrimaryColorContext} from '../../../Context';
import {useDispatch} from 'react-redux';
import {setCategoryName} from '../../../Redux/Reducers/product';
import useCategories from '../../../Hooks/useCategory';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  color?: string;
  handleCategoryState: (newValue: number) => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  color,
  handleCategoryState,
}) => {
  const [categoriesName, setCategoriesName] = useState('');
  const [selectedCategories, setSelectedCategories] = useState(0);
  const {categories} = useCategories();
  const primaryColor = useContext(PrimaryColorContext);
  const dispatch = useDispatch();

  const handleChange = (newValue: number) => {
    handleCategoryState(newValue);
  };

  return (
    <Center>
      <Modal size={'full'} isOpen={isOpen} onClose={onClose}>
        <Modal.Content mt={'auto'} maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>
            <Text bold fontSize={'2xl'}>
              Etalase
            </Text>
          </Modal.Header>
          <Modal.Body>
            <Pressable
              onPress={() => {
                setCategoriesName('Semua Produk');
                setSelectedCategories(0);
              }}>
              <View flexDirection={'row'}>
                <Text flex={11} mb={2}>
                  Semua Produk
                </Text>
                <View flex={1} mb={2}>
                  {selectedCategories === 0 ? (
                    <AntDesign
                      name={'checkcircle'}
                      size={20}
                      color={primaryColor?.primaryColor}
                    />
                  ) : null}
                </View>
              </View>
            </Pressable>
            <Divider />
            {categories?.map(item => (
              <Pressable
                key={item?.id}
                onPress={() => {
                  setCategoriesName(item?.name);
                  setSelectedCategories(item?.id);
                }}>
                <View key={item?.id}>
                  <View flexDirection={'row'} my={2}>
                    <Text flex={11}>{item?.name}</Text>
                    <View flex={1}>
                      {selectedCategories === item?.id ? (
                        <AntDesign
                          name={'checkcircle'}
                          size={20}
                          color={primaryColor?.primaryColor}
                        />
                      ) : null}
                    </View>
                  </View>
                  <Divider />
                </View>
              </Pressable>
            ))}
            <Button
              mt={4}
              onPress={() => {
                handleChange(selectedCategories);
                onClose();
                dispatch(setCategoryName(categoriesName));
              }}
              borderRadius={34}
              alignItems={'center'}
              justifyContent={'center'}
              bg={color || primaryColor?.primaryColor}>
              <Text fontSize={'lg'} color="white">
                Tampilkan
              </Text>
            </Button>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Center>
  );
};

export default CategoryModal;
