import React, {useContext} from 'react';
import {View, Text, Divider, ScrollView, Pressable} from 'native-base';
import HeaderComponent from '../../Components/Header/Header';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {RefreshControl} from 'react-native';
import useUserInfo from '../../Hooks/useUserInfo';
import {useReport} from '../../Hooks/useReport';
import {PrimaryColorContext} from '../../Context';
import RupiahFormatter from '../../Util/Rupiah/Rupiah';
import {useTranslation} from 'react-i18next';

interface HomeProps {
  navigation: any;
}
const HomeScreen: React.FC<HomeProps> = ({navigation}) => {
  const {t} = useTranslation();
  const primaryColor = useContext(PrimaryColorContext);

  const {reportDataTotal} = useReport();
  const {userData, handleRefresh} = useUserInfo();
  return (
    <>
      <HeaderComponent />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={handleRefresh} />
        }>
        <View borderRadius={10} p={4} bg={'white'} mx={4} my={4}>
          <Text bold fontSize={'lg'}>
            {userData?.name}
          </Text>
          <Text>
            {t('role-name')} {userData?.role}{' '}
          </Text>
          <Divider mt={2} />
        </View>
        <View borderRadius={10} p={4} bg={'white'} mx={4} my={4}>
          <Text>{t('start-selling')}</Text>
          <View borderRadius={20} flexDirection={'row'} mt={4}>
            <View flex={2} justifyContent={'center'} alignItems={'center'}>
              <View
                mr={4}
                justifyContent={'center'}
                alignItems={'center'}
                borderWidth={1}
                w={35}
                h={35}
                borderRadius={18}
                borderColor={'#2dbf52'}>
                <View>
                  <Ionicons name="checkmark-circle" size={20} color="#2dbf52" />
                </View>
              </View>
            </View>
            <View flex={10} bg={'white'} shadow={4} borderRadius={10} p={2}>
              <View flexDirection={'row'}>
                <View flex={8}>
                  <Text color={'#b0b4d8'} fontSize={'xs'}>
                    {t('step-one-title')}
                  </Text>
                  <Text bold color={'#b0b4d8'}>
                    {t('step-one')}
                  </Text>
                </View>
                <View
                  justifyContent={'center'}
                  alignItems={'flex-end'}
                  flex={4}>
                  <AntDesign
                    name="right"
                    size={15}
                    color={primaryColor?.primaryColor}
                  />
                </View>
              </View>
            </View>
          </View>

          <View borderRadius={20} flexDirection={'row'} mt={2}>
            <View flex={2} justifyContent={'center'} alignItems={'center'}>
              <View mr={4}>
                <Entypo name="flow-line" size={35} color="#2dbf52" />
              </View>
            </View>
            <View flex={10} bg={'white'} p={2} />
          </View>
          <View mb={4} borderRadius={20} flexDirection={'row'}>
            <View flex={2} justifyContent={'center'} alignItems={'center'}>
              <View
                mr={4}
                justifyContent={'center'}
                alignItems={'center'}
                borderWidth={1}
                w={35}
                h={35}
                borderRadius={18}
                borderColor={'#b0b4d8'}>
                <View>
                  <MaterialIcons name="store" size={20} color="#b0b4d8" />
                </View>
              </View>
            </View>
            <Pressable
              flex={10}
              bg={'white'}
              shadow={4}
              borderRadius={10}
              onPress={() =>
                navigation.navigate('Dashboard', {screen: 'Cashier'})
              }
              p={2}>
              <View flexDirection={'row'}>
                <View flex={8}>
                  <Text fontSize={'xs'}>{t('step-two-title')}</Text>
                  <Text bold color={primaryColor?.primaryColor}>
                    {t('step-two')}
                  </Text>
                </View>
                <View
                  justifyContent={'center'}
                  alignItems={'flex-end'}
                  flex={4}>
                  <AntDesign
                    name="right"
                    size={15}
                    color={primaryColor?.primaryColor}
                  />
                </View>
              </View>
            </Pressable>
          </View>
        </View>

        <View borderBottomRadius={10} bg={'white'} mx={4}>
          {reportDataTotal?.map((item, index) => {
            return (
              <React.Fragment key={index}>
                <View
                  shadow={4}
                  bg={'white'}
                  mx={4}
                  mt={4}
                  borderRadius={10}
                  borderColor={'white'}
                  borderWidth={1}>
                  <View mx={4} my={2}>
                    <Text color={'#b0b4d8'}>{item?.ref}</Text>
                    <Text bold fontSize={'xl'}>
                      {RupiahFormatter(item?.total)}
                    </Text>
                    <Text color={'#b0b4d8'}>
                      {item?.total_transaction + 'Transaksi'}
                    </Text>
                  </View>
                </View>
              </React.Fragment>
            );
          })}
          <Pressable
            onPress={() => navigation.navigate('ReportScreen')}
            mt={4}
            flexDirection={'row'}>
            <Text
              flex={1}
              mx={4}
              my={4}
              bold
              color={primaryColor?.primaryColor}>
              {t('see-all')}
            </Text>
            <View my={4} flex={1} mx={4} alignItems="flex-end">
              <AntDesign
                name="right"
                size={20}
                color={primaryColor?.primaryColor}
              />
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </>
  );
};

export default HomeScreen;
