import React, {FunctionComponent, useContext, useState} from 'react';
import {
  Button,
  FormControl,
  Input,
  Stack,
  Text,
  useToast,
  WarningOutlineIcon,
} from 'native-base';
import NavBar from '../../Components/Navbar/Navbar';
import {useNavigation} from '@react-navigation/native';
import categoryNetwork from '../../Network/lib/categories';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ToastAlert from '../../Components/Toast/Toast';
import {PrimaryColorContext} from '../../Context';

interface CategoryScreenProps {}

const AddCategoryScreen: FunctionComponent<CategoryScreenProps> = () => {
  const toast = useToast();

  const [name, setName] = useState<string | undefined>('');
  const [description, setDescription] = useState<string | undefined>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigation = useNavigation();
  const primaryColor = useContext(PrimaryColorContext);
  const postCategory = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await categoryNetwork.createCategory({
        name: name,
        description: description,
      });
      if (response) {
        ToastAlert(toast, 'sukses', 'Kategori Berhasil Ditambahkan');
        setIsLoading(false);
        navigation.goBack();
      }
    } catch (error: any) {
      setIsLoading(false);
      ToastAlert(toast, 'error', error?.response?.data?.message);
      throw error;
    }
  };

  return (
    <>
      <NavBar msg={'Tambah Kategori'} />
      <FormControl isRequired>
        <Stack mx={4} mt={4}>
          <FormControl.Label>Nama Kategori</FormControl.Label>
          <Input
            bg={'white'}
            borderRadius={10}
            onChangeText={text => setName(text)}
            type="text"
            maxLength={30}
            placeholder="Contoh: Makanan, Minuman"
          />
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            Silakan Isi Nama Anda.
          </FormControl.ErrorMessage>
        </Stack>
        <Stack mx={4} mt={4}>
          <FormControl.Label>Deskripsi Kategori</FormControl.Label>
          <Input
            bg={'white'}
            borderRadius={10}
            onChangeText={text => setDescription(text)}
            type="text"
            maxLength={30}
            placeholder="Contoh: Makanan khas dengan kearifan lokal"
          />
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            Silakan Isi Nama Anda.
          </FormControl.ErrorMessage>
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
          <MaterialIcons name="save" size={15} color="white" /> Simpan Kategori
        </Text>
      </Button>
    </>
  );
};

export default AddCategoryScreen;
