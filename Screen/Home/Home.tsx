import React from 'react';
import {
  View,
  Text,
  Divider,
  ScrollView,
  FlatList,
  Pressable,
  Image,
} from 'native-base';
import {HeaderComponent} from '../../Components/Header/Header';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import orderOnline from '../../Public/Assets/order-online.jpg';
import thumb1 from '../../Public/Assets/thumb1.png';
import FastImage from 'react-native-fast-image';
import thumb2 from '../../Public/Assets/thumb2.png';
import thumb3 from '../../Public/Assets/thumb3.jpeg';
import thumb4 from '../../Public/Assets/thumb5.jpeg';
import thumb5 from '../../Public/Assets/thumb4.jpeg';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {WavePatternComponent} from '../../Components/WavePattern/WavePattern';
// import {LineChart} from 'react-native-chart-kit';
import {RefreshControl, StyleSheet} from 'react-native';
import useNetworkInfo from '../../Hooks/useNetworkInfo';
import useUserInfo from '../../Hooks/useUserInfo';
import RupiahFormatter from '../../Components/Rupiah/Rupiah';
import {useReport} from '../../Hooks/useReport';

interface HomeProps {
  navigation: any;
}
export const HomeScreen: React.FC<HomeProps> = ({navigation}) => {
  const isConnected = useNetworkInfo().isConnected;
  const {reportDataTotal} = useReport();
  const {userData, handleRefresh} = useUserInfo();
  // const data = {
  //   labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
  //   datasets: [
  //     {
  //       data: [20, 45, 28, 80, 99],
  //     },
  //   ],
  // };
  const dataFlat = [
    {
      key: '1',
      label: 'Item 1',
      image: thumb1,
    },
    {
      key: '2',
      label: 'Item 2',
      image: thumb4,
    },
    {
      key: '3',
      label: 'Item 3',
      image: thumb5,
    },
    {
      key: '4',
      label: 'Item 4',
      image: thumb3,
    },
    {
      key: '5',
      label: 'Item 5',
      image: thumb2,
    },
  ];

  interface Item {
    key: string;
    label: string;
    image: ReturnType<typeof require>; // Use the correct type for require
  }

  const renderItem: React.FC<{item: Item}> = ({item}) => (
    // <View mx={2} p={1}>
    //   <FastImage
    //     style={styles.image}
    //     source={{uri: item?.image}}
    //     // source={{uri: item?.image}}
    //     resizeMode={FastImage.resizeMode.contain}
    //   />
    // </View>
    <View mx={2} p={1}>
      <Image
        source={item.image}
        alt={'gambar thumbnail'}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );

  return (
    <>
      <HeaderComponent />
      {/* <CheckConnectionComponent /> */}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={handleRefresh} />
        }>
        <View borderRadius={10} p={4} bg={'white'} mx={4} my={4}>
          <Text bold fontSize={'lg'}>
            {userData?.name}
          </Text>
          <Text>Anda sebagai Pemilik {isConnected ? 'online' : 'offline'}</Text>
          <Divider mt={2} />
          <View mt={4} flexDirection={'row'}>
            <View flex={1}>
              <Text>Total Poin Kasir</Text>
            </View>
            <View flex={1} alignItems={'flex-end'}>
              <Text>Belum ada poin</Text>
            </View>
          </View>
        </View>
        <View
          borderRadius={20}
          flexDirection={'row'}
          p={4}
          bg={'white'}
          mx={4}
          my={2}>
          <View flex={1} justifyContent={'center'} alignItems={'center'}>
            <Entypo name="info-with-circle" size={20} color="#0c50ef" />
          </View>
          <View flex={10}>
            <Text>
              Yuk tingkatkan aktivitas transaksi toko dan nikmati pencairan
              hingga 10 juta.
            </Text>
          </View>
        </View>

        <View borderRadius={10} p={4} bg={'white'} mx={4} my={4}>
          <Text>Mulai jualan di Hidup Merchant yuk !</Text>
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
                    Langkah 1
                  </Text>
                  <Text bold color={'#b0b4d8'}>
                    Tambah Produk
                  </Text>
                </View>
                <View
                  justifyContent={'center'}
                  alignItems={'flex-end'}
                  flex={4}>
                  <AntDesign name="right" size={15} color="#0c50ef" />
                </View>
              </View>
            </View>
          </View>
          <View>
            <Entypo name="flow-line" size={35} color="#2dbf52" />
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
                  <Text fontSize={'xs'}>Langkah 2</Text>
                  <Text bold color={'#0c50ef'}>
                    Mulai Jualan
                  </Text>
                </View>
                <View
                  justifyContent={'center'}
                  alignItems={'flex-end'}
                  flex={4}>
                  <AntDesign name="right" size={15} color="#0c50ef" />
                </View>
              </View>
            </Pressable>
          </View>
        </View>
        <WavePatternComponent />
        <View borderBottomRadius={10} bg={'white'} mx={4}>
          {/* <View
            mx={4}
            mb={4}
            justifyContent={'center'}
            bg={'white'}
            alignItems={'center'}>
            <View mt={4}>
              <LineChart
                data={data}
                width={300}
                height={200}
                chartConfig={{
                  backgroundColor: 'white',
                  backgroundGradientFrom: 'white',
                  backgroundGradientTo: 'white',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                }}
              />
            </View>
          </View> */}

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
            <Text flex={1} mx={4} my={4} bold color={'#0c50ef'}>
              Lihat Selengkapnya
            </Text>
            <View my={4} flex={1} mx={4} alignItems="flex-end">
              <AntDesign name="right" size={20} color="#0c50ef" />
            </View>
          </Pressable>
        </View>
        <View>
          <FlatList
            data={dataFlat}
            horizontal
            renderItem={renderItem}
            keyExtractor={item => item.key}
          />
        </View>
        <View mx={4} my={4} flexDirection={'row'}>
          <View flex={1}>
            <Text bold>Pesanan Online</Text>
          </View>
          <View flex={1} alignItems={'flex-end'}>
            <Text bold color={'#0c50ef'}>
              Lihat Semua
            </Text>
          </View>
        </View>
        <View bg={'white'} mb={4} borderRadius={10} mx={4}>
          <View alignSelf={'center'}>
            {/* <Image
              source={orderOnline}
              size="2xl"
              resizeMode="contain"
              alt="logo-pemkab"
            /> */}
            <FastImage
              style={styles.online}
              source={orderOnline}
              resizeMode={FastImage.resizeMode.contain}
            />
          </View>
          <Text bold fontSize={20} alignSelf={'center'}>
            Belum Ada Pesanan
          </Text>
          <Text mb={4} alignSelf={'center'}>
            Belum ada pembeli yang order di toko Anda
          </Text>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
  },
  online: {
    width: 250,
    height: 250,
  },
});
