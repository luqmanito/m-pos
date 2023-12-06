import React, {useContext, useState} from 'react';
import {
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
import {PrimaryColorContext, useLoading} from '../../Context';
import {ParamListBase, RouteProp} from '@react-navigation/native';
import BaseInput from '../../Components/Form/BaseInput';
import useErrorHandler from '../../Hooks/useErrorHandler';
import {formatPrice} from '../../Components/Rupiah/RupiahFormatter';

export type YourNavigatorParamList = {
  ProductDetail: {
    productId: number;
  };
} & ParamListBase;

type ProductDetailScreenProps = {
  route: RouteProp<YourNavigatorParamList, 'ProductDetail'>;
  navigation: any;
};

const ProductDetail: React.FC<ProductDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [deleteProduct, setDeleteProduct] = useState<boolean>(false);
  const dispatch = useDispatch();
  const productId =
    route?.params?.productId === undefined ? null : route.params.productId;
  const dataCamera = useSelector(
    (state: RootState) => state.uploadSlice.dataCamera,
  );
  const categoryName = useSelector(
    (state: RootState) => state.productSlice?.categoryName,
  );
  const {photos, form, resetphotos, handleForm} = useProductDetail(productId);
  const {handleDeletedPhoto, handleSubmit, handleAddSubmit} = useEditPhoto();
  const {getFormError, clearFormErrors, isInvalid} = useErrorHandler();
  const {handleSubmitDelete} = useDeleteProduct();
  const {loading} = useLoading();
  const primaryColor = useContext(PrimaryColorContext);
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
          <BaseInput
            inputKey={'name'}
            isRequired={true}
            label={'Nama Produk'}
            defaultValue={productId ? form.name : ''}
            placeholder={'Contoh: Nasi Goreng'}
            type={'text'}
            isInvalid={isInvalid('name')}
            warningMessage={getFormError('name')}
            onChangeText={text => handleForm('name', text)}
          />
          <Stack mt={4}>
            <FormControl.Label>Kategori</FormControl.Label>
            <Pressable onPress={() => navigation.navigate('CategoryScreen')}>
              <Input
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
          <BaseInput
            inputKey={'code'}
            isRequired={true}
            label={'Kode'}
            defaultValue={productId ? form.code : ''}
            placeholder={'Kode Produk'}
            type={'text'}
            isInvalid={isInvalid('code')}
            warningMessage={getFormError('code')}
            onChangeText={text => handleForm('code', text)}
          />
          <BaseInput
            inputKey={'description'}
            isRequired={true}
            label={'Deskripsi'}
            defaultValue={productId ? form.description : ''}
            placeholder={'Jelaskan apa yang spesial dari produkmu'}
            type={'text'}
            isInvalid={isInvalid('description')}
            warningMessage={getFormError('description')}
            onChangeText={text => handleForm('description', text)}
          />
          <BaseInput
            inputKey={'price'}
            isRequired={true}
            label={'Harga'}
            placeholder={'Masukkan Harga'}
            type={'text'}
            defaultValue={
              form.price !== undefined ? RupiahFormatter(form.price) : ''
            }
            keyboardType="numeric"
            isInvalid={isInvalid('price')}
            warningMessage={getFormError('price')}
            onChangeText={text => handleForm('price', formatPrice(text))}
          />
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
              !form.name ||
              !form.code ||
              !categoryName ||
              !form.description ||
              !form.price
                ? true
                : false
            }
            onPress={() => {
              clearFormErrors();
              productId !== null
                ? handleSubmit({
                    name: form.name,
                    code: form.code,
                    description: form.description,
                    price: form.price,
                    productId,
                  })
                : handleAddSubmit({
                    name: form.name,
                    code: form.code,
                    description: form.description,
                    price: form.price,
                  });
              setIsOpen(false);
            }}
            isLoading={loading ? true : false}
            isLoadingText="Loading"
            w={'80%'}
            ml={4}
            alignItems={'center'}
            justifyContent={'center'}
            bg={primaryColor?.primaryColor}>
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
export default ProductDetail;
