import React, {useState} from 'react';
import {
  Box,
  Button,
  Center,
  FormControl,
  HStack,
  Icon,
  Image,
  Input,
  Modal,
  ScrollView,
  Stack,
  Text,
  TextArea,
  View,
  VStack,
} from 'native-base';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import {UploadComp} from '../../Components/Upload/Upload';
import {clearDataCamera} from '../../Redux/Reducers/upload';
import {RootState} from '../../Redux/store';

import {Pressable} from 'react-native';
import NavBar from '../../Components/Navbar/Navbar';
import RupiahFormatter from '../../Components/Rupiah/Rupiah';
import useProductDetail from '../../Hooks/useProductDetail';
import useEditPhoto from '../../Hooks/useEditPhoto';
import useDeleteProduct from '../../Hooks/useDeleteProduct';
import {useLoading} from '../../Context';

interface addProductProps {
  navigation: any;
}

export const ProductDetail: React.FC<addProductProps> = ({navigation}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [deleteProduct, setDeleteProduct] = useState<boolean>(false);
  const dispatch = useDispatch();
  const dataCamera = useSelector(
    (state: RootState) => state.uploadSlice.dataCamera,
  );
  const categoryName = useSelector(
    (state: RootState) => state.productSlice?.categoryName,
  );
  const {
    name,
    description,
    code,
    price,
    photos,
    resetphotos,
    handlePriceChange,
    handleCodeChange,
    handleDescriptionChange,
    handleNameChange,
  } = useProductDetail();
  const {handleDeletedPhoto, handleSubmit} = useEditPhoto();
  const {handleSubmitDelete} = useDeleteProduct();
  const {loading} = useLoading();

  function deleteMedia(): void {
    setIsOpen(false);
    resetphotos();
    handleDeletedPhoto();
  }

  return (
    <>
      <NavBar msg={'Detail Produk'} />
      <ScrollView>
        <View flex={1} mb={4} mx={4} mt={4}>
          <View>
            <Text>
              Foto Produk <Text color={'gray.400'}>(Optional)</Text>{' '}
            </Text>
          </View>
          <HStack mt={2} space={3}>
            <VStack paddingLeft={4}>
              {dataCamera || photos ? (
                <View width={120} position={'relative'}>
                  <Image
                    position={'relative'}
                    alignItems="flex-end"
                    source={photos ? {uri: photos} : {uri: dataCamera?.uri}}
                    width={100}
                    height={120}
                    alt="logo-pemkab"
                  />
                  <View
                    position={'absolute'}
                    top={5}
                    mt={-7}
                    color={'red.100'}
                    right={3}>
                    <MaterialIcons
                      onPress={() => {
                        dispatch(clearDataCamera());
                        // setPhotos('');
                        setIsOpen(true);
                      }}
                      name="cancel"
                      size={27}
                      color="gray"
                    />
                  </View>
                </View>
              ) : (
                <UploadComp position="bottom" title="Foto Produk" size="full" />
              )}
            </VStack>
          </HStack>
          <FormControl isRequired>
            <Stack mt={4}>
              <FormControl.Label>Nama Produk</FormControl.Label>
              <Input
                bg={'white'}
                value={name}
                borderRadius={10}
                onChangeText={text => handleNameChange(text)}
                type="text"
                placeholder="Contoh: Nasi Goreng, Sepatu Lari"
              />
            </Stack>
            <Stack mt={4}>
              <FormControl.Label>Code</FormControl.Label>
              <Input
                bg={'white'}
                value={code}
                borderRadius={10}
                onChangeText={handleCodeChange}
                type="text"
                placeholder="Kode Produk"
              />
            </Stack>
            <Stack mt={4}>
              <FormControl.Label>Kategori</FormControl.Label>
              <Pressable onPress={() => navigation.navigate('CategoryScreen')}>
                <Input
                  bg={'white'}
                  borderRadius={10}
                  isReadOnly={true}
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
            </Stack>
            <Stack mt={4}>
              <FormControl.Label>Deskripsi</FormControl.Label>
              <Box alignItems="center" w="100%">
                <TextArea
                  onChangeText={handleDescriptionChange}
                  h={20}
                  value={description}
                  bg={'white'}
                  borderRadius={10}
                  placeholder="Jelaskan apa yang spesial dari produkmu"
                  autoCompleteType={undefined}
                />
              </Box>
            </Stack>
            <Stack mt={4}>
              <FormControl.Label>Harga</FormControl.Label>
              <Input
                bg={'white'}
                borderRadius={10}
                value={price !== undefined ? RupiahFormatter(price) : ''}
                onChangeText={handlePriceChange}
                keyboardType={'numeric'}
                placeholder="Masukkan Harga"
              />
            </Stack>
          </FormControl>
        </View>
        <View mx={4} bottom={0} my={4} flexDirection={'row'}>
          <View
            w={50}
            h={50}
            borderRadius={25}
            bg={'#fdecec'}
            justifyContent={'center'}
            alignItems={'center'}>
            <MaterialIcons
              disabled={loading}
              onPress={() => {
                setDeleteProduct(true);
                setIsOpen(true);
              }}
              name="delete"
              size={25}
              color="#ef4536"
            />
          </View>
          <Button
            flex={1}
            borderRadius={34}
            isDisabled={
              !name || !code || !categoryName || !description || !price
                ? true
                : false
            }
            onPress={() => {
              handleSubmit({name, code, description, price});
              setIsOpen(false);
            }}
            isLoading={loading ? true : false}
            isLoadingText="Loading"
            w={'80%'}
            ml={4}
            alignItems={'center'}
            justifyContent={'center'}
            bg={'#0c50ef'}>
            <Text fontSize={'md'} color="white">
              <MaterialIcons name="save" color="white" /> Simpan
            </Text>
          </Button>
        </View>
      </ScrollView>
      <Center>
        <Modal
          size={'lg'}
          isOpen={isOpen}
          onClose={() => {
            setDeleteProduct(false);
            setIsOpen(false);
          }}>
          <Modal.Content mb={0} maxWidth="400px">
            <Modal.CloseButton />
            <Modal.Header>
              {deleteProduct ? 'Hapus Produk' : 'Hapus Foto'}
            </Modal.Header>
            <Text mx={4} mt={4}>
              {deleteProduct
                ? 'Apakah Anda yakin akan menghapus produk ini ?'
                : 'Apa Anda yakin akan menghapus foto ?'}
            </Text>
            <Modal.Body flexDirection={'row'}>
              <Button
                flex={1}
                mx={4}
                isLoading={loading}
                bg={'#ef4536'}
                onPress={() => {
                  deleteProduct ? handleSubmitDelete() : deleteMedia();
                }}>
                <Text color={'#fdecec'}>Ya</Text>
              </Button>
              <Button
                flex={1}
                bg={'#fdecec'}
                isLoading={loading}
                onPress={() => {
                  setDeleteProduct(false);
                  setIsOpen(false);
                }}>
                <Text color={'#ef4536'}>Tidak</Text>
              </Button>
            </Modal.Body>
          </Modal.Content>
        </Modal>
      </Center>
    </>
  );
};
