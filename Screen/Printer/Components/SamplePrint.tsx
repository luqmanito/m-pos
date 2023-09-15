import {Button, useToast, View} from 'native-base';
import React from 'react';
import {StyleSheet} from 'react-native';
import {BluetoothEscposPrinter} from 'react-native-bluetooth-escpos-printer';
import {hsdLogo} from './dummy-logo';
import ToastAlert from '../../../Components/Toast/Toast';

type SamplePrintProps = {
  status: boolean;
};

const SamplePrint = ({status}: SamplePrintProps) => {
  const toast = useToast();
  return (
    <>
      <View style={styles.btn}>
        <Button
          isDisabled={status}
          borderRadius={12}
          bg={'emerald.500'}
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
                ['Jl. Brigjen Saptadji Hadiprawira No.93'],
                {},
              );
              await BluetoothEscposPrinter.printColumn(
                [16],
                [BluetoothEscposPrinter.ALIGN.CENTER],
                ['https://xfood.id'],
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
                ['Customer', 'Prawito Hudoro'],
                {},
              );
              await BluetoothEscposPrinter.printColumn(
                [16, 16],
                [
                  BluetoothEscposPrinter.ALIGN.LEFT,
                  BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ['Packaging', 'Iya'],
                {},
              );
              await BluetoothEscposPrinter.printColumn(
                [16, 16],
                [
                  BluetoothEscposPrinter.ALIGN.LEFT,
                  BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ['Delivery', 'Ambil Sendiri'],
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
              await BluetoothEscposPrinter.printColumn(
                columnWidths,
                [
                  BluetoothEscposPrinter.ALIGN.LEFT,
                  BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ['1x Cumi-Cumi', 'Rp.200.000'],
                {},
              );
              await BluetoothEscposPrinter.printColumn(
                columnWidths,
                [
                  BluetoothEscposPrinter.ALIGN.LEFT,
                  BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ['1x Tongkol Kering', 'Rp.300.000'],
                {},
              );
              await BluetoothEscposPrinter.printColumn(
                columnWidths,
                [
                  BluetoothEscposPrinter.ALIGN.LEFT,
                  BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ['1x Ikan Tuna', 'Rp.400.000'],
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
                ['Subtotal', 'Rp.900.000'],
                {},
              );
              await BluetoothEscposPrinter.printColumn(
                [16, 16],
                [
                  BluetoothEscposPrinter.ALIGN.LEFT,
                  BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ['Packaging', 'Rp.6.000'],
                {},
              );
              await BluetoothEscposPrinter.printColumn(
                [16, 16],
                [
                  BluetoothEscposPrinter.ALIGN.LEFT,
                  BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ['Delivery', 'Rp.0'],
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
                ['Total', 'Rp.906.000'],
                {},
              );
              await BluetoothEscposPrinter.printText('\r\n\r\n', {});
              await BluetoothEscposPrinter.printerAlign(
                BluetoothEscposPrinter.ALIGN.CENTER,
              );
              await BluetoothEscposPrinter.printerAlign(
                BluetoothEscposPrinter.ALIGN.CENTER,
              );
              await BluetoothEscposPrinter.printText(
                '================================',
                {},
              );
              await BluetoothEscposPrinter.printColumn(
                [32],
                [BluetoothEscposPrinter.ALIGN.CENTER],
                ['Sabtu, 18 Juni 2022 - 06:00 WIB'],
                {},
              );
              await BluetoothEscposPrinter.printText(
                '================================',
                {},
              );
              await BluetoothEscposPrinter.printText('\r\n\r\n\r\n', {});
              await BluetoothEscposPrinter.printText('\r\n\r\n\r\n', {});
            } catch (e: any) {
              ToastAlert(
                toast,
                'error',
                e.message ? 'Printer belum terhubung' : 'ERROR',
              );
            }
          }}>
          Test Print
        </Button>
      </View>
    </>
  );
};

export default SamplePrint;

const styles = StyleSheet.create({
  btn: {
    marginBottom: 4,
  },
});
