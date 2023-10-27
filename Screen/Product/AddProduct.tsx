import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  HStack,
  VStack,
  Flex,
  Image,
  useToast,
  FormControl,
  Stack,
  Input,
  WarningOutlineIcon,
  Button,
  Icon,
  TextArea,
  Box,
  ScrollView,
} from 'native-base';
import ProductNetwork from '../../Network/lib/product';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSelector, useDispatch} from 'react-redux';
import {UploadComp} from '../../Components/Upload/Upload';
import {clearDataCamera} from '../../Redux/Reducers/upload';
import {RootState} from '../../Redux/store';
import ToastAlert from '../../Components/Toast/Toast';
import {Pressable} from 'react-native';
import NavBar from '../../Components/Navbar/Navbar';
import RupiahFormatter from '../../Components/Rupiah/Rupiah';
import {formatPrice} from '../../Components/Rupiah/RupiahFormatter';
import {PrimaryColorContext} from '../../Context';

interface addProductProps {
  navigation: any;
}

export const AddProductScreen: React.FC<addProductProps> = ({navigation}) => {
  const [name, setName] = useState<string | undefined>('');
  const [code, setCode] = useState<string | undefined>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [description, setDescription] = useState<string | undefined>('');
  const [price, setPrice] = useState<number | undefined>(0);
  const dispatch = useDispatch();
  const dataCamera = useSelector(
    (state: RootState) => state.uploadSlice.dataCamera,
  );
  const categoryName = useSelector(
    (state: RootState) => state.productSlice?.categoryName,
  );
  const categoryCode = useSelector(
    (state: RootState) => state.productSlice?.categoryCode,
  );
  const primaryColor = useContext(PrimaryColorContext);
  const toast = useToast();
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('code', code);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('status', 1);
      formData.append('category', categoryCode);
      if (dataCamera) {
        const imagesArray = [];
        imagesArray.push({
          uri: dataCamera?.uri,
          name: dataCamera?.fileName,
          size: dataCamera?.fileSize,
          type: dataCamera?.type,
        });
        formData.append('images[]', imagesArray[0]);
      }
      const response = await ProductNetwork.create({
        data: formData,
      });
      if (response) {
        setIsLoading(false);
        ToastAlert(toast, 'sukses', 'Produk Berhasil Ditambahkan');
        navigation.navigate('Dashboard', {screen: 'Catalogue'});
      }
    } catch (error: any) {
      setIsLoading(false);
      ToastAlert(toast, 'error', error?.response?.data?.message);
      console.log(error);
    }
  };

  const handlePriceChange = (text: string) => setPrice(formatPrice(text));

  return (
    <>
      <NavBar msg={'Tambah Produk'} />
      <ScrollView>
        <View flex={1} mx={4} mt={4}>
          <Text>
            Foto Produk <Text color={'gray.400'}>(Optional)</Text>{' '}
          </Text>
          <HStack mt={2} space={3}>
            <VStack paddingLeft={4}>
              <Flex>
                {dataCamera ? (
                  <View width={120} position={'relative'}>
                    <Image
                      position={'relative'}
                      alignItems="flex-end"
                      source={{uri: dataCamera?.uri}}
                      // source={store}
                      width={100}
                      height={120}
                      alt="logo-pemkab"
                      // fallbackSource={noImage}
                    />
                    <View
                      position={'absolute'}
                      top={5}
                      mt={-7}
                      color={'red.100'}
                      right={3}>
                      <MaterialIcons
                        onPress={() => dispatch(clearDataCamera())}
                        name="cancel"
                        size={27}
                        color="gray"
                      />
                    </View>
                  </View>
                ) : (
                  <UploadComp
                    position="bottom"
                    title="Foto Produk"
                    size="full"
                  />
                )}
              </Flex>
            </VStack>
          </HStack>
          <FormControl isRequired>
            <Stack mt={4}>
              <FormControl.Label>Nama Produk</FormControl.Label>
              <Input
                bg={'white'}
                borderRadius={10}
                onChangeText={text => setName(text)}
                type="text"
                placeholder="Contoh: Nasi Goreng, Sepatu Lari"
              />
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}>
                Silakan Isi Nama Anda.
              </FormControl.ErrorMessage>
            </Stack>
            <Stack mt={4}>
              <FormControl.Label>Code</FormControl.Label>
              <Input
                bg={'white'}
                borderRadius={10}
                onChangeText={text => setCode(text)}
                type="text"
                placeholder="Kode Produk"
              />
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}>
                Silakan Isi Nama Anda.
              </FormControl.ErrorMessage>
            </Stack>
            <Stack mt={4}>
              <FormControl.Label>Kategori</FormControl.Label>
              <Pressable onPress={() => navigation.navigate('CategoryScreen')}>
                <Input
                  // onPressIn={() => navigation.navigate('CategoryScreen')}
                  bg={'white'}
                  borderRadius={10}
                  isReadOnly={true}
                  onChangeText={text => setDescription(text)}
                  type="text"
                  placeholder="Pilih Kategori"
                  value={categoryName ? categoryName : ''}
                  InputRightElement={
                    <Icon
                      as={<Ionicons name={'chevron-forward'} />}
                      size={6}
                      mr="2"
                      color="muted.400"
                    />
                  }
                />
              </Pressable>
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}>
                Silakan Isi Nama Anda.
              </FormControl.ErrorMessage>
            </Stack>
            <Stack mt={4}>
              <FormControl.Label>Deskripsi</FormControl.Label>
              <Box alignItems="center" w="100%">
                <TextArea
                  onChangeText={text => setDescription(text)}
                  h={20}
                  bg={'white'}
                  borderRadius={10}
                  placeholder="Jelaskan apa yang spesial dari produkmu"
                  autoCompleteType={undefined}
                />
              </Box>

              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}>
                Silakan Isi Nama Anda.
              </FormControl.ErrorMessage>
            </Stack>
            <Stack mt={4}>
              <FormControl.Label>Harga</FormControl.Label>
              <Input
                bg={'white'}
                value={price !== undefined ? RupiahFormatter(price) : ''}
                borderRadius={10}
                onChangeText={handlePriceChange}
                type="text"
                placeholder="Masukkan Harga"
              />
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}>
                Silakan Isi Nama Anda.
              </FormControl.ErrorMessage>
            </Stack>
          </FormControl>
        </View>
        <View mx={4}>
          <Button
            my={8}
            borderRadius={34}
            isDisabled={
              !name || !code || !categoryName || !description || !price
                ? true
                : false
            }
            onPress={handleSubmit}
            isLoading={isLoading ? true : false}
            isLoadingText="Loading"
            w={'100%'}
            alignSelf="center"
            bg={primaryColor?.primaryColor}>
            <Text fontSize={'md'} color="white">
              <MaterialIcons name="save" color="white" /> Simpan
            </Text>
          </Button>
        </View>
      </ScrollView>
    </>
  );
};
