import React, {useState, useCallback, useContext} from 'react';
import {
  View,
  Button,
  Text,
  Input,
  Pressable,
  Center,
  ScrollView,
  Icon,
  Divider,
  Modal,
} from 'native-base';
import {Calendar, DateData, LocaleConfig} from 'react-native-calendars';
import Foundation from 'react-native-vector-icons/Foundation';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import {StyleSheet} from 'react-native';
import {clearStateProduct} from '../../Redux/Reducers/product';
import {useDispatch} from 'react-redux';
import {clearDataCamera} from '../../Redux/Reducers/upload';
import RupiahFormatter from '../../Components/Rupiah/Rupiah';
import {formatTime} from '../../Components/Time/Time';
import formatDate from '../../Components/Date/Date';

import useOrders from '../../Hooks/useOrders';
// import {todayBahasa} from '../../Components/Date/Today';
import useNetworkInfo from '../../Hooks/useNetworkInfo';
import {PrimaryColorContext} from '../../Context';

interface PaymentInfo {
  totalPrice: string | number;
  totalPayment: number;
  exchangePayment: number;
  invoiceNumber: string | null;
  datePayment: string | undefined;
  cashierName: string | null;
}

const initialPaymentInfo: PaymentInfo = {
  totalPrice: '',
  totalPayment: 0,
  exchangePayment: 0,
  invoiceNumber: null,
  datePayment: undefined,
  cashierName: null,
};

export const TransactionScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [activeTab, setActiveTab] = useState('Tab1');
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenCalendar, setIsOpenCalendar] = useState(false);
  const dispatch = useDispatch();
  const primaryColor = useContext(PrimaryColorContext);
  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
  };

  useFocusEffect(
    useCallback(() => {
      dispatch(clearStateProduct());
      dispatch(clearDataCamera());
    }, [dispatch]),
  );

  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [activeMethod, setActiveMethod] = useState('method1');
  const {orders} = useOrders();
  const [paymentInfo, setPaymentInfo] =
    useState<PaymentInfo>(initialPaymentInfo);

  const [selectedStartDate, setSelectedStartDate] = useState('');
  const [selectedEndDate, setSelectedEndDate] = useState('');

  const handleDayPress = (day: DateData) => {
    if (!selectedStartDate || selectedEndDate) {
      setSelectedStartDate(day.dateString);
      // setSelectedStartDate(day.toString);
      setSelectedEndDate('');
    } else {
      // setSelectedEndDate(day.toString);
      setSelectedEndDate(day.dateString);
    }
  };

  interface MarkedDate {
    startingDay?: boolean;
    endingDay?: boolean;
    color: string;
    textColor: string;
  }

  const markedDates: Record<string, MarkedDate> = {};

  markedDates[selectedStartDate] = {
    startingDay: true,
    color: primaryColor?.primaryColor ? primaryColor?.primaryColor : '#20b529',
    textColor: 'white',
  };

  markedDates[selectedEndDate] = {
    endingDay: true,
    color: primaryColor?.primaryColor ? primaryColor?.primaryColor : '#20b529',
    textColor: 'white',
  };

  const formatShortDate = (dateString: string) => {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'Mei',
      'Jun',
      'Jul',
      'Agt',
      'Sep',
      'Okt',
      'Nov',
      'Des',
    ];

    const date = new Date(dateString);
    const day = date.getDate();
    const month = months[date.getMonth()];

    return `${day} ${month}`;
  };

  LocaleConfig.locales.ina = {
    monthNames: [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember',
    ],
    monthNamesShort: [
      'Jan.',
      'Feb.',
      'Mar',
      'Apr',
      'Mei',
      'Jun',
      'Jul.',
      'Agu',
      'Sep.',
      'Okt.',
      'Nov.',
      'Des.',
    ],
    dayNames: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'],
    dayNamesShort: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
    today: 'Hari ini',
  };
  LocaleConfig.defaultLocale = 'ina';

  const start = new Date(selectedStartDate);
  const end = new Date(selectedEndDate);

  const currentDate = new Date(start);
  currentDate.setDate(currentDate.getDate() + 1);

  while (currentDate < end) {
    const dateString = currentDate.toISOString().split('T')[0];
    markedDates[dateString] = {
      color: primaryColor?.primaryColor
        ? primaryColor?.primaryColor
        : '#20b529',
      textColor: 'black',
    };
    currentDate.setDate(currentDate.getDate() + 1);
  }
  const isConnected = useNetworkInfo().isConnected;
  return (
    <>
      <View
        width={'100%'}
        flexDirection={'row'}
        justifyContent={'space-between'}
        alignItems={'center'}
        paddingX={5}
        paddingTop={30}>
        <View flexDirection={'row'} alignItems={'center'}>
          <Text color={'black'} fontSize={'3xl'} bold>
            Transaksi
          </Text>
          <View>
            <MaterialCommunityIcons
              name={isConnected ? 'wifi-check' : 'wifi-remove'}
              size={24}
              color="#fff"
              style={isConnected ? styles.wifi : styles.wifi_off}
            />
          </View>
        </View>
        <View flexDirection={'row'}>
          <Button
            borderRadius={20}
            onPress={() => {
              navigation.navigate('ReportScreen');
            }}
            alignSelf="center"
            bg={primaryColor?.secondaryColor}>
            <Text
              fontSize={'md'}
              mx={2}
              bold
              color={primaryColor?.primaryColor}>
              <Foundation name="graph-bar" color={primaryColor?.primaryColor} />{' '}
              Laporan
            </Text>
          </Button>
        </View>
      </View>

      <View mx={6} mt={4} flexDirection={'row'}>
        <Pressable
          p={2}
          mb={4}
          onPress={() => handleTabPress('Tab1')}
          bg={activeTab === 'Tab1' ? primaryColor?.secondaryColor : null}
          w={'50%'}
          borderRadius={20}>
          <Text
            textAlign={'center'}
            bold
            color={primaryColor?.primaryColor}
            borderRadius={20}>
            Pendapatan
          </Text>
        </Pressable>
        <Pressable
          p={2}
          mb={4}
          onPress={() => handleTabPress('Tab2')}
          bg={activeTab === 'Tab2' ? primaryColor?.secondaryColor : null}
          w={'50%'}
          borderRadius={20}>
          <Text
            textAlign={'center'}
            bold
            color={primaryColor?.primaryColor}
            borderRadius={20}>
            Pencairan
          </Text>
        </Pressable>
      </View>
      {activeTab === 'Tab1' ? (
        <ScrollView>
          <View borderBottomWidth={0.2} my={4} flexDirection={'row'}>
            <Button
              bg={'transparent'}
              _text={
                activeMethod === 'method1'
                  ? {
                      color: primaryColor?.primaryColor,
                    }
                  : {
                      color: '#1F2937',
                    }
              }
              onPress={() => setActiveMethod('method1')}
              variant="unstyled"
              borderBottomColor={
                activeMethod === 'method1' ? primaryColor?.primaryColor : null
              }
              borderBottomWidth={activeMethod === 'method1' ? 2 : 0}
              textAlign={'center'}
              flex={1}>
              Semua Metode
            </Button>

            <Button
              bg={'transparent'}
              _text={
                activeMethod === 'method2'
                  ? {
                      color: primaryColor?.primaryColor,
                    }
                  : {
                      color: '#1F2937',
                    }
              }
              onPress={() => setActiveMethod('method2')}
              variant="unstyled"
              borderBottomColor={
                activeMethod === 'method2' ? primaryColor?.primaryColor : null
              }
              borderBottomWidth={activeMethod === 'method2' ? 2 : 0}
              textAlign={'center'}
              flex={1}>
              Tunai
            </Button>
            <Button
              bg={'transparent'}
              _text={
                activeMethod === 'method3'
                  ? {
                      color: primaryColor?.primaryColor,
                    }
                  : {
                      color: '#1F2937',
                    }
              }
              onPress={() => setActiveMethod('method3')}
              variant="unstyled"
              borderBottomColor={
                activeMethod === 'method3' ? primaryColor?.primaryColor : null
              }
              borderBottomWidth={activeMethod === 'method3' ? 2 : 0}
              textAlign={'center'}
              flex={1}>
              QRIS
            </Button>
          </View>
          <View mx={4}>
            <Pressable onPress={() => setIsOpenCalendar(true)}>
              <Input
                bg={'white'}
                borderRadius={10}
                isReadOnly={true}
                type="text"
                placeholder="Pilih Tanggal"
                value={
                  selectedStartDate
                    ? `${selectedStartDate} s/d ${selectedEndDate}`
                    : ''
                }
                InputLeftElement={
                  <Icon
                    as={<Ionicons name={'calendar'} />}
                    size={6}
                    ml="2"
                    color={primaryColor?.primaryColor}
                  />
                }
                InputRightElement={
                  <Icon
                    as={<Ionicons name={'chevron-down'} />}
                    size={6}
                    mr="2"
                    color={primaryColor?.primaryColor}
                  />
                }
              />
            </Pressable>
          </View>
          <Pressable
            onPress={() => {
              setIsVisible(!isVisible);
            }}>
            <View
              mt={4}
              mx={4}
              borderTopRadius={10}
              borderBottomRadius={isVisible ? 0 : 10}
              borderTopColor={'gray.200'}
              bg={'white'}>
              <View my={4} flexDirection={'row'}>
                <Text mx={4} fontSize={'lg'} flex={2} bold>
                  {/* {todayBahasa} */}
                  Hasil Transaksi
                </Text>
                <View mr={4} alignItems={'flex-end'} flex={1}>
                  <AntDesign
                    name={isVisible ? 'up' : 'down'}
                    size={15}
                    color={primaryColor?.primaryColor}
                  />
                </View>
              </View>
            </View>
          </Pressable>
          {isVisible
            ? orders.map((item, index) => {
                return (
                  <Pressable
                    key={item?.id}
                    onPress={() => {
                      setPaymentInfo(prevInfo => ({
                        ...prevInfo,
                        totalPrice: item?.total,
                        datePayment: item?.created_at,
                        invoiceNumber: item?.order_code,
                        cashierName: item?.created_by?.name,
                        totalPayment: item?.total_paid,
                      }));
                      setIsOpen(true);
                    }}>
                    <View
                      key={item?.id}
                      mx={4}
                      mb={index === orders.length - 1 ? 4 : 0}
                      bg={'white'}
                      borderColor={'dark.600'}
                      borderBottomRadius={index === orders.length - 1 ? 10 : 0}
                      borderTopWidth={1}>
                      <View flexDirection={'row'}>
                        <Text my={4} fontSize="lg" mx={4} flex={2}>
                          <Entypo
                            name="wallet"
                            size={15}
                            color={primaryColor?.primaryColor}
                          />
                          {item?.payment_method_id === 1
                            ? 'Tunai'
                            : 'Non-Tunai'}
                        </Text>
                        <View my={2} flex={2} flexDirection={'column'}>
                          <Text
                            color={primaryColor?.primaryColor}
                            bold
                            textAlign={'right'}
                            mx={4}
                            fontSize={'lg'}>
                            {RupiahFormatter(item?.total)}
                          </Text>
                          <Text mx={4} textAlign={'right'} fontSize={'sm'}>
                            {formatTime(item.created_at)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </Pressable>
                );
              })
            : null}
        </ScrollView>
      ) : (
        <ScrollView>
          <Text>tes2</Text>
        </ScrollView>
      )}
      <Center>
        <Modal size={'full'} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <Modal.Content mt={'auto'} maxWidth="400px">
            <Modal.CloseButton />
            <Modal.Header>
              <Text bold fontSize={'2xl'}>
                Rincian
              </Text>
            </Modal.Header>
            <Modal.Body>
              <Text fontSize={'3xl'} bold color={primaryColor?.primaryColor}>
                {RupiahFormatter(paymentInfo?.totalPrice)}
              </Text>
              <Text my={2}>
                Pembayaran berhasil via{' '}
                {paymentInfo?.totalPayment === 0 ? 'Non Tunai' : 'Tunai'}
              </Text>
              <Divider />
              <Text mt={2} fontSize={'lg'} bold>
                Detail Transaksi
              </Text>
              <View mb={2} mt={4} flexDirection={'row'}>
                <Text flex={1}>Tanggal</Text>
                <Text flex={1}>{formatDate(paymentInfo?.datePayment)}</Text>
              </View>
              <View mb={2} flexDirection={'row'}>
                <Text flex={1}>Nomor Pesanan</Text>
                <Text flex={1}>{paymentInfo?.invoiceNumber}</Text>
              </View>
              <View mb={2} flexDirection={'row'}>
                <Text flex={1}>Nominal Pembayaran</Text>
                <Text flex={1}>
                  {paymentInfo?.totalPayment === 0
                    ? RupiahFormatter(paymentInfo?.totalPrice)
                    : RupiahFormatter(paymentInfo?.totalPayment)}
                </Text>
              </View>
              {paymentInfo?.totalPayment !== 0 ? (
                <View mb={2} flexDirection={'row'}>
                  <Text flex={1}>Kembalian</Text>
                  <Text flex={1}>
                    {paymentInfo?.totalPayment ===
                    Number(paymentInfo?.totalPrice)
                      ? 'Rp.0'
                      : RupiahFormatter(
                          paymentInfo?.totalPayment -
                            Number(paymentInfo?.totalPrice),
                        )}
                  </Text>
                </View>
              ) : null}

              <Divider />
              <View my={4} flexDirection={'row'}>
                <Text flex={1}>Nama Kasir</Text>
                <Text flex={1}>{paymentInfo?.cashierName}</Text>
              </View>
              <Button
                onPress={() => setIsOpen(false)}
                borderRadius={34}
                alignItems={'center'}
                justifyContent={'center'}
                bg={primaryColor?.primaryColor}>
                <Text fontSize={'lg'} color="white">
                  Oke
                </Text>
              </Button>
            </Modal.Body>
          </Modal.Content>
        </Modal>
      </Center>

      <Center>
        <Modal
          size={'full'}
          isOpen={isOpenCalendar}
          onClose={() => setIsOpenCalendar(false)}>
          <Modal.Content mt={'auto'} maxWidth="400px">
            <Modal.CloseButton />
            <Modal.Header>
              <Text bold fontSize={'2xl'}>
                Periode Transaksi
              </Text>
            </Modal.Header>
            <Modal.Body bg={'white'}>
              <Text>
                Periode transaksi yang tersimpan maksimum 6 bulan terakhir
              </Text>
              <View style={styles.container}>
                <Calendar
                  markingType="period"
                  markedDates={markedDates}
                  onDayPress={handleDayPress}
                  monthNames={[]}
                  dayNames={[
                    'Minggu',
                    'Senin',
                    'Selasa',
                    'Rabu',
                    'Kamis',
                    'Jumat',
                    'Sabtu',
                  ]}
                />
              </View>
              <Button
                onPress={() => setIsOpenCalendar(false)}
                isDisabled={
                  selectedStartDate > selectedEndDate
                    ? true
                    : !selectedStartDate || !selectedEndDate
                    ? true
                    : false
                }
                borderRadius={34}
                mt={4}
                alignItems={'center'}
                justifyContent={'center'}
                bg={primaryColor?.primaryColor}>
                <Text fontSize={'lg'} color="white">
                  Pilih Tanggal
                  {` ${
                    selectedStartDate ? formatShortDate(selectedStartDate) : ''
                  } ${
                    selectedStartDate === selectedEndDate
                      ? ''
                      : selectedEndDate
                      ? '- ' + formatShortDate(selectedEndDate)
                      : ''
                  }`}
                </Text>
              </Button>
            </Modal.Body>
          </Modal.Content>
        </Modal>
      </Center>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  wifi: {
    marginLeft: 10,
    color: '#2dbf52',
  },
  wifi_off: {
    marginLeft: 10,
    color: '#fc2b0c',
  },
});
