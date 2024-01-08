import {Button, Text, View} from 'native-base';
import React, {useContext, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {BluetoothEscposPrinter} from 'react-native-bluetooth-escpos-printer';
import {useSelector} from 'react-redux';
import {RootState} from '../../../Redux/store';
import userNetwork from '../../../Network/lib/user';
import {hsdLogo} from './dummy-logo';
import {PrimaryColorContext} from '../../../Context';
import RupiahFormatter from '../../../Util/Rupiah/Rupiah';
import formatDate from '../../../Util/Date/Date';
import useAlert from '../../../Hooks/useAlert';
import {useTranslation} from 'react-i18next';

const PrintReceipt = () => {
  const {t} = useTranslation();
  const primaryColor = useContext(PrimaryColorContext);
  const paymentReceipt = useSelector(
    (state: RootState) => state.paymentSlice.items[0],
  );
  const alert = useAlert();
  useEffect(() => {
    const fetchUserInfo = async (): Promise<[]> => {
      try {
        const response = await userNetwork.userProfile();
        return response.data.data;
      } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
    };

    fetchUserInfo();
  }, []);
  return (
    <>
      <View style={styles.btn}>
        <Button
          borderRadius={12}
          mx={4}
          mt={4}
          bg={primaryColor?.secondaryColor}
          onPress={async () => {
            let columnWidths = [16, 16];
            try {
              await BluetoothEscposPrinter.printText('\r\n', {});
              await BluetoothEscposPrinter.printPic(hsdLogo, {
                width: 250,
                left: 50,
              });

              await BluetoothEscposPrinter.printColumn(
                [32],
                [BluetoothEscposPrinter.ALIGN.CENTER],
                [`${paymentReceipt?.invoiceNumber}`],
                {},
              );
              await BluetoothEscposPrinter.printColumn(
                [32],
                [BluetoothEscposPrinter.ALIGN.CENTER],
                ['jl. alamat toko no. 5'],
                {},
              );
              await BluetoothEscposPrinter.printText(
                '================================',
                {},
              );
              await BluetoothEscposPrinter.printColumn(
                [16, 16],
                [
                  BluetoothEscposPrinter.ALIGN.LEFT,
                  BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ['Cashier', `${paymentReceipt?.cashierName}`],
                {},
              );
              await BluetoothEscposPrinter.printText(
                '================================',
                {},
              );
              await BluetoothEscposPrinter.printText('Products\r\n', {
                widthtimes: 1,
              });

              await BluetoothEscposPrinter.printText(
                '================================',
                {},
              );
              paymentReceipt?.products?.map(item => {
                return BluetoothEscposPrinter.printColumn(
                  columnWidths,
                  [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                  ],
                  [
                    `${item?.quantity}x ${item?.name}`,
                    `${RupiahFormatter(item?.quantity * item?.price)}`,
                  ],
                  {},
                );
              });
              await BluetoothEscposPrinter.printText(
                '================================',
                {},
              );
              await BluetoothEscposPrinter.printColumn(
                [16, 16],
                [
                  BluetoothEscposPrinter.ALIGN.LEFT,
                  BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ['Subtotal', `${RupiahFormatter(paymentReceipt?.totalPrice)}`],
                {},
              );
              await BluetoothEscposPrinter.printColumn(
                [16, 16],
                [
                  BluetoothEscposPrinter.ALIGN.LEFT,
                  BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ['Payment', `${RupiahFormatter(paymentReceipt?.totalPayment)}`],
                {},
              );
              await BluetoothEscposPrinter.printText(
                '================================',
                {},
              );
              await BluetoothEscposPrinter.printColumn(
                [16, 16],
                [
                  BluetoothEscposPrinter.ALIGN.LEFT,
                  BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                [
                  'Exchange',
                  `${RupiahFormatter(paymentReceipt?.exchangePayment)}`,
                ],
                {},
              );
              await BluetoothEscposPrinter.printText(
                '================================',
                {},
              );
              await BluetoothEscposPrinter.printColumn(
                [32],
                [BluetoothEscposPrinter.ALIGN.CENTER],
                [`${formatDate(paymentReceipt?.datePayment)}`],
                {},
              );
              await BluetoothEscposPrinter.printText(
                '================================',
                {},
              );
              await BluetoothEscposPrinter.printText('\r\n\r\n\r\n', {});
              await BluetoothEscposPrinter.printText('\r\n\r\n\r\n', {});
            } catch (e: any) {
              alert.showAlert('error', e.message ? t('disconnected') : 'ERROR');
            }
          }}>
          <Text bold>{t('print-receipt')}</Text>
        </Button>
      </View>
    </>
  );
};

export default PrintReceipt;

const styles = StyleSheet.create({
  btn: {
    marginBottom: 4,
  },
});
