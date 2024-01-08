import React, {useContext, useState} from 'react';
import {
  Button,
  HStack,
  Icon,
  Image,
  ScrollView,
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
import useProductDetail from '../../Hooks/useProductDetail';
import useEditPhoto from '../../Hooks/useEditPhoto';
import {PrimaryColorContext, useLoading} from '../../Context';
import {RouteProp} from '@react-navigation/native';
import BaseInput from '../../Components/Form/BaseInput';
import {RootStackParamList} from '../../Navigation/RootStackParamList';
import RupiahFormatter from '../../Util/Rupiah/Rupiah';
import {formatPrice} from '../../Util/Rupiah/RupiahFormatter';
import DeletePhotoModal from './Components/DeletePhotoModal';
import {useTranslation} from 'react-i18next';

type ProductDetailScreenProps = {
  route: RouteProp<RootStackParamList, 'ProductDetailsScreen'>;
  navigation: any;
};

const ProductDetail: React.FC<ProductDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const {t} = useTranslation();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [deleteProduct, setDeleteProduct] = useState<boolean>(false);
  const dispatch = useDispatch();
  const id = route?.params?.id === undefined ? null : route.params.id;
  const dataCamera = useSelector(
    (state: RootState) => state.uploadSlice.dataCamera,
  );
  const categoryName = useSelector(
    (state: RootState) => state.productSlice?.categoryName,
  );
  const {photos, form, resetphotos, handleForm} = useProductDetail(id);
  const {
    handleDeletedPhoto,
    handleSubmit,
    handleAddSubmit,
    getFormError,
    clearFormErrors,
    isInvalid,
  } = useEditPhoto();
  const {loading, setLoading} = useLoading();
  setLoading(false);
  const primaryColor = useContext(PrimaryColorContext);

  const submittedData = {
    name: form.name,
    code: form.code,
    description: form.description,
    price: form.price,
    productId: id,
  };

  function submitData(): void {
    clearFormErrors();
    id !== null ? handleSubmit(submittedData) : handleAddSubmit(submittedData);
    setIsOpen(false);
  }

  const updateParentState = (newValue: boolean) => {
    setDeleteProduct(newValue);
  };

  return (
    <>
      <NavBar msg={id ? t('product-detail') : t('add-product')} />
      <ScrollView>
        <View flex={1} mb={4} mx={4} mt={4}>
          <View>
            <Text>
              {t('product-photo')}{' '}
              <Text color={'gray.400'}>({t('optional')})</Text>{' '}
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
                    alt="foto-produk"
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
                <UploadComp
                  position="bottom"
                  title={t('product-photo')}
                  size="full"
                />
              )}
            </VStack>
          </HStack>
          <BaseInput
            inputKey={'name'}
            isRequired={true}
            label={t('product-name')}
            defaultValue={id ? form.name : ''}
            placeholder={t('product-placeholder')}
            type={'text'}
            isInvalid={isInvalid('name')}
            warningMessage={getFormError('name')}
            onChangeText={text => handleForm('name', text)}
          />
          <Pressable onPress={() => navigation.navigate('CategoryScreen')}>
            <BaseInput
              inputKey={'category'}
              isReadOnly={true}
              isRequired={true}
              label={t('category')}
              defaultValue={categoryName ? categoryName : ''}
              placeholder={t('set-category')}
              isInvalid={isInvalid('category')}
              rightIcon={
                <Icon
                  as={<Ionicons name={'chevron-forward'} />}
                  size={6}
                  mr="2"
                  color="muted.400"
                />
              }
              warningMessage={getFormError('category')}
            />
          </Pressable>
          <BaseInput
            inputKey={'code'}
            isRequired={true}
            label={t('code')}
            defaultValue={id ? form.code : ''}
            placeholder={t('code-product')}
            type={'text'}
            isInvalid={isInvalid('code')}
            warningMessage={getFormError('code')}
            onChangeText={text => handleForm('code', text)}
          />
          <BaseInput
            inputKey={'description'}
            isRequired={true}
            label={t('description')}
            defaultValue={id ? form.description : ''}
            placeholder={t('desc-placeholder')}
            type={'text'}
            isInvalid={isInvalid('description')}
            warningMessage={getFormError('description')}
            onChangeText={text => handleForm('description', text)}
          />
          <BaseInput
            inputKey={'price'}
            isRequired={true}
            label={t('price')}
            placeholder={t('input-price')}
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
            bg={id ? '#fdecec' : 'gray.300'}
            justifyContent={'center'}
            alignItems={'center'}>
            <MaterialIcons
              disabled={loading || id === null ? true : false}
              onPress={() => {
                setDeleteProduct(true);
                setIsOpen(true);
              }}
              name="delete"
              size={25}
              color={id ? '#ef4536' : 'gray'}
            />
          </View>
          <Button
            flex={1}
            borderRadius={34}
            onPress={submitData}
            disabled={loading}
            isLoading={loading}
            isLoadingText="Loading"
            w={'80%'}
            ml={4}
            alignItems={'center'}
            justifyContent={'center'}
            bg={primaryColor?.primaryColor}>
            <Text fontSize={'md'} color="white">
              <MaterialIcons name="save" color="white" /> {t('save')}
            </Text>
          </Button>
        </View>
      </ScrollView>
      <DeletePhotoModal
        isDeleteProduct={deleteProduct}
        id={id}
        handleDeletedPhoto={handleDeletedPhoto}
        resetphotos={resetphotos}
        isOpen={isOpen}
        updateParentState={updateParentState}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};
export default ProductDetail;
