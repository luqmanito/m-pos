import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export const settingsData = [
  {
    id: 1,
    iconElement: Entypo,
    bg: '#fffae5',
    icon: 'wallet',
    iconColor: '#fdcc00',
    title: 'Metode Pembayaran',
    description: 'Atur metode pembayaran usahamu',
    screen: 'PaymentSettings',
    divider: true,
    permission: ['ADMIN'],
  },
  {
    id: 2,
    iconElement: Ionicons,
    bg: '#e3e9ff',
    icon: 'people',
    iconColor: '#0c50ef',
    title: 'Pegawai',
    description: 'Pengaturan seputar pegawaimu',
    screen: 'EmployeeSettings',
    divider: true,
    permission: ['ADMIN'],
  },
  {
    id: 9,
    iconElement: Ionicons,
    bg: '#f7f7f7',
    icon: 'sync-circle-sharp',
    iconColor: '#00a7e7',
    title: 'Penyelarasan Data',
    description: 'Atur penyelarasan data dengan server',
    screen: 'SyncDataScreen',
    divider: true,
    permission: ['ADMIN', 'USER'],
  },
  {
    id: 3,
    iconElement: MaterialIcons,
    bg: '#f5effb',
    icon: 'print',
    iconColor: '#b052de',
    title: 'Perangkat',
    description: 'Atur perangkat untuk bertransaksi',
    screen: 'PrinterSetting',
    divider: true,
    permission: ['ADMIN', 'USER'],
  },
  {
    id: 4,
    iconElement: FontAwesome,
    bg: '#edf7ee',
    icon: 'whatsapp',
    iconColor: '#4faf4e',
    title: 'Layanan Pelanggan',
    description: 'Sampaikan kritik dan saranmu',
    screen: 'CustomerService',
    divider: false,
    permission: ['ADMIN', 'USER'],
  },
];
