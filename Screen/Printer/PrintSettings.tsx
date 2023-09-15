import {Badge, ScrollView, Button, Text, View, useToast} from 'native-base';
import React, {useState, useEffect, useCallback} from 'react';
import {BluetoothManager} from 'react-native-bluetooth-escpos-printer';
import {PERMISSIONS, requestMultiple, RESULTS} from 'react-native-permissions';
import ItemList from './Components/ItemList';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import SamplePrint from './Components/SamplePrint';

import {
  ActivityIndicator,
  DeviceEventEmitter,
  PermissionsAndroid,
  Platform,
  ToastAndroid,
} from 'react-native';
import NavBar from '../../Components/Navbar/Navbar';
import {setBluetoohName, setBluetoohStatus} from '../../Redux/Reducers/button';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../Redux/store';
import ToastAlert from '../../Components/Toast/Toast';

const PrinterSetting = () => {
  const dispatch = useDispatch();
  const bluetoothState = useSelector(
    (state: RootState) => state.buttonSlice.bluetoothStatus,
  );
  const bluetoothName = useSelector(
    (state: RootState) => state.buttonSlice.bluetoothName,
  );

  type PairedProps = {
    name: string;
    address: string;
  };

  const [pairedDevices, setPairedDevices] = useState<PairedProps[]>([]);
  const [foundDs, setFoundDs] = useState<{address: any}[]>([]);
  const [bleOpend, setBleOpend] = useState(false);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const navigation = useNavigation<NavigationProp<any>>();

  const deviceAlreadPaired = useCallback(
    (rsp: {devices: string}) => {
      var ds = null;
      if (typeof rsp.devices === 'object') {
        ds = rsp.devices;
      } else {
        try {
          ds = JSON.parse(rsp.devices);
        } catch (e) {}
      }
      if (ds && ds.length) {
        let pared = pairedDevices;
        if (pared.length < 1) {
          pared = pared.concat(ds || []);
        }
        setPairedDevices(pared);
      }
    },
    [pairedDevices],
  );

  const deviceFoundEvent = useCallback(
    (rsp: {device: string}) => {
      var r: {address: any} | null = null;
      try {
        if (typeof rsp.device === 'object') {
          r = rsp.device;
        } else {
          r = JSON.parse(rsp.device);
        }
      } catch (e) {
        // ignore error
      }

      if (r) {
        let found: {address: any}[] = foundDs || [];
        if (found.findIndex) {
          let duplicated = found.findIndex(function (x) {
            return x.address === r?.address;
          });
          if (duplicated === -1) {
            found.push(r);
            setFoundDs(found);
          }
        }
      }
    },
    [foundDs],
  );

  const scanDevices = useCallback(() => {
    setLoading(true);
    BluetoothManager.scanDevices().then(
      (s: {found: any}) => {
        // const pairedDevices = s.paired;
        var found = s.found;
        try {
          found = JSON.parse(found); //@FIX_it: the parse action too weired..
        } catch (e) {
          //ignore
        }
        var fds = foundDs;
        if (found && found.length) {
          fds = found;
        }
        setFoundDs(fds);
        setLoading(false);
      },
      () => {
        setLoading(false);
        // ignore
      },
    );
  }, [foundDs]);

  const scan = useCallback(() => {
    try {
      async function blueTooth() {
        const permissions = {
          title: 'HSD bluetooth meminta izin untuk mengakses bluetooth',
          message:
            'HSD bluetooth memerlukan akses ke bluetooth untuk proses koneksi ke bluetooth printer',
          buttonNeutral: 'Lain Waktu',
          buttonNegative: 'Tidak',
          buttonPositive: 'Boleh',
        };

        const bluetoothConnectGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          permissions,
        );
        if (bluetoothConnectGranted === PermissionsAndroid.RESULTS.GRANTED) {
          const bluetoothScanGranted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            permissions,
          );
          if (bluetoothScanGranted === PermissionsAndroid.RESULTS.GRANTED) {
            scanDevices();
          }
        } else {
          // ignore akses ditolak
        }
      }
      blueTooth();
    } catch (err) {
      console.warn(err);
    }
  }, [scanDevices]);

  useEffect(() => {
    BluetoothManager.isBluetoothEnabled().then(
      (enabled: boolean) => {
        setBleOpend(Boolean(enabled));
        setLoading(false);
      },
      (err: any) => {
        err;
      },
    );

    if (Platform.OS === 'android') {
      DeviceEventEmitter.addListener(
        BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED,
        rsp => {
          deviceAlreadPaired(rsp);
        },
      );
      DeviceEventEmitter.addListener(
        BluetoothManager.EVENT_DEVICE_FOUND,
        rsp => {
          deviceFoundEvent(rsp);
        },
      );
      DeviceEventEmitter.addListener(
        BluetoothManager.EVENT_CONNECTION_LOST,
        () => {
          dispatch(setBluetoohName(''));
          dispatch(setBluetoohStatus(''));
        },
      );
      DeviceEventEmitter.addListener(
        BluetoothManager.EVENT_BLUETOOTH_NOT_SUPPORT,
        () => {
          ToastAndroid.show(
            'Device Not Support Bluetooth !',
            ToastAndroid.LONG,
          );
        },
      );
    }
    if (pairedDevices.length < 1) {
      scan();
    }
  }, [
    dispatch,
    bluetoothState,
    deviceAlreadPaired,
    deviceFoundEvent,
    pairedDevices,
    scan,
  ]);

  interface Row {
    address: string;
    name?: string;
  }

  const connect = (row: Row) => {
    setLoading(true);
    BluetoothManager.connect(row.address).then(
      () => {
        setLoading(false);
        dispatch(setBluetoohStatus(row.address));
        dispatch(setBluetoohName(row?.name || 'UNKNOWN'));
      },
      (e: any) => {
        setLoading(false);
        ToastAlert(toast, 'error', e.message || 'ERROR');
      },
    );
  };

  const unPair = (address: string) => {
    setLoading(true);
    BluetoothManager.unpaire(address).then(
      () => {
        setLoading(false);
        dispatch(setBluetoohStatus(''));
        dispatch(setBluetoohName(''));
      },
      (e: any) => {
        setLoading(false);
        ToastAlert(toast, 'error', e.message || 'ERROR');
      },
    );
  };

  const scanBluetoothDevice = async () => {
    setLoading(true);
    try {
      const request = await requestMultiple([
        PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
        PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      ]);

      if (
        request['android.permission.ACCESS_FINE_LOCATION'] === RESULTS.GRANTED
      ) {
        scanDevices();
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar msg="Perangkat" />
      <ScrollView mx={4}>
        <View mt={4} justifyContent={'flex-end'} alignSelf={'flex-end'}>
          <Badge
            colorScheme={bleOpend ? 'success' : 'info'}
            alignSelf="center"
            borderRadius={14}
            variant={'subtle'}>
            <Text bold color={bleOpend ? '#2ebd53' : 'blue.500'}>
              Bluetooth {bleOpend ? 'Aktif' : 'Non Aktif'}
            </Text>
          </Badge>
        </View>
        {!bleOpend && (
          <Text mt={4} textAlign={'center'} fontSize={20} color={'info.500'}>
            Mohon aktifkan bluetooth anda !
          </Text>
        )}

        {bluetoothState?.length > 0 ? (
          <Text>Printer yang terhubung ke aplikasi:</Text>
        ) : null}

        {bluetoothState?.length > 0 && (
          <ItemList
            label={bluetoothName}
            value={bluetoothState}
            onPress={() => unPair(bluetoothState)}
            actionText="Putus"
            color="#E9493F"
          />
        )}
        {bluetoothState?.length < 1 && (
          <Text textAlign={'center'} fontSize={16} color={'#E9493F'} mb={4}>
            Belum ada printer yang terhubung
          </Text>
        )}
        {loading ? <ActivityIndicator animating={true} /> : null}
        <View flex={1} flexDirection="column">
          {pairedDevices.map((item, index) => {
            return (
              <ItemList
                key={index}
                onPress={() => connect(item)}
                label={item.name}
                value={item.address}
                connected={item.address === bluetoothState}
                actionText="Hubungkan"
                color="#0c50ef"
              />
            );
          })}
        </View>
        <SamplePrint status={bluetoothState?.length < 1 ? true : false} />
        <Button
          isDisabled={bluetoothState?.length < 1 ? true : false}
          my={4}
          borderRadius={12}
          bg={'#0c50ef'}
          onPress={() => navigation.navigate('PrinterConfiguration')}>
          Pengaturan Printer
        </Button>
        <Button
          borderRadius={12}
          bg={'#0c50ef'}
          onPress={() => scanBluetoothDevice()}>
          Scan Bluetooth
        </Button>
        <View h={100} />
      </ScrollView>
    </>
  );
};

export default PrinterSetting;
