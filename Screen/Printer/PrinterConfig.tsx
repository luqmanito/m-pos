import {
  Button,
  Center,
  Flex,
  FormControl,
  HStack,
  Image,
  Input,
  Stack,
  Text,
  View,
  VStack,
} from 'native-base';
import React, {useContext, useState} from 'react';
import NavBar from '../../Components/Navbar/Navbar';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {UploadComp} from '../../Components/Upload/Upload';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../Redux/store';
import {clearDataCamera} from '../../Redux/Reducers/upload';
import {PrimaryColorContext} from '../../Context';
import {useTranslation} from 'react-i18next';

const PrinterConfiguration = () => {
  const dataCamera = useSelector(
    (state: RootState) => state.uploadSlice.dataCamera,
  );
  const {t} = useTranslation();
  const primaryColor = useContext(PrimaryColorContext);
  const [sizePaper, setSizePaper] = useState('');
  const [name, setName] = useState('');
  const navigation = useNavigation<NavigationProp<any>>();
  const dispatch = useDispatch();
  return (
    <>
      <NavBar msg="Pengaturan Printer" />
      <FormControl mt={4}>
        <Stack mx="4">
          <FormControl.Label>{t('device-name')}</FormControl.Label>
          <Input
            onChangeText={text => setName(text)}
            type={'text'}
            placeholder="Printer Toko 1"
          />
        </Stack>
      </FormControl>
      <FormControl mt={4}>
        <Stack mx="4">
          <FormControl.Label>{t('paper-size')}</FormControl.Label>
          <Input
            onChangeText={text => setSizePaper(text)}
            type={'text'}
            placeholder={`${t('example')} : 48, 40, 38`}
          />
        </Stack>
      </FormControl>
      <Text bold mx={4} mt={4}>
        {t('logo')}
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
                title={t('product-photo')}
                size="full"
              />
            )}
          </Flex>
        </VStack>
      </HStack>
      <Center h={250}>
        <View position={'absolute'} bottom={10} w={'90%'}>
          <Button
            borderRadius={34}
            isLoadingText="Loading"
            w={'100%'}
            marginTop={5}
            bg={primaryColor?.primaryColor}>
            <Text fontSize={'md'} color="white">
              <Entypo name="save" size={15} color="white" /> {t('save-changes')}
            </Text>
          </Button>

          <Button
            borderRadius={34}
            onPress={() => navigation.navigate('RegisterScreen')}
            isLoadingText="Loading"
            w={'100%'}
            marginTop={5}
            bg={'#E9493F'}>
            <Text fontSize={'md'} color="white">
              <AntDesign name="disconnect" size={15} color="white" />
              {t('disconnect')}
            </Text>
          </Button>
        </View>
      </Center>
    </>
  );
};

export default PrinterConfiguration;
