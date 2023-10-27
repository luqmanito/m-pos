import React, {useContext} from 'react';
import {View, Text} from 'native-base';
// import Svg, {Path, Defs, LinearGradient, Stop} from 'react-native-svg';
// import {StyleSheet} from 'react-native';
import formattedDate from '../Date/Today';
import {useReport} from '../../Hooks/useReport';
import RupiahFormatter from '../Rupiah/Rupiah';
import {PrimaryColorContext} from '../../Context';

export const WavePatternComponent: React.FC = () => {
  const {reportDataTotal} = useReport();
  let totalPriceTransaction = 0;
  let totalTransaction = 0;
  const primaryColor = useContext(PrimaryColorContext);
  if (reportDataTotal) {
    reportDataTotal.forEach(item => {
      totalPriceTransaction += Number(item.total);
      totalTransaction += Number(item?.total_transaction);
    });
  }
  return (
    <>
      <View
        h={90}
        mx={4}
        borderTopRadius={10}
        position={'relative'}
        overflow="hidden"
        bg={primaryColor?.primaryColor}>
        {/* <Svg
          height="100%"
          width="100%"
          viewBox="0 0 1440 320"
          style={styles.wave}>
          <Defs>
            <LinearGradient id="gradient1" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={primaryColor?.primaryColor} />
              <Stop offset="1" stopColor="#00a1ff" />
            </LinearGradient>
          </Defs>
          <Path
            fill="url(#gradient1)"
            fillOpacity={1}
            d="M0,160C160,192,320,224,480,202.7C640,181,800,107,960,85.3C1120,64,1280,96,1360,112L1440,128L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,0,320L0,320Z"
          />
        </Svg>

        <Svg
          height="100%"
          width="100%"
          viewBox="0 0 1440 320"
          style={styles.wave}>
          <Defs>
            <LinearGradient id="gradient2" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#33ccff" />
              <Stop offset="1" stopColor="#00a1ff" />
            </LinearGradient>
          </Defs>
          <Path
            fill="url(#gradient2)"
            fillOpacity={1}
            d="M0,96C160,128,320,192,480,186.7C640,181,800,107,960,85.3C1120,64,1280,96,1360,112L1440,128L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,0,0L0,0Z"
          />
        </Svg>

        <Svg
          height="100%"
          width="100%"
          viewBox="0 0 1440 320"
          style={styles.wave}>
          <Defs>
            <LinearGradient id="gradient3" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={primaryColor?.primaryColor} />
              <Stop offset="1" stopColor="#4d79ff" />
            </LinearGradient>
          </Defs>
          <Path
            fill="url(#gradient3)"
            fillOpacity={1}
            d="M0,96C160,128,320,192,480,186.7C640,181,800,107,960,85.3C1120,64,1280,96,1360,112L1440,128L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,0,0L0,0Z"
          />
        </Svg> */}
        <View position={'absolute'} mx={4} mt={3}>
          <Text color={'white'} bold>
            {`Pendapatan Hari Ini, ${formattedDate}`}
          </Text>
          <Text color={'white'} bold fontSize={'xl'}>
            {RupiahFormatter(totalPriceTransaction)}
          </Text>
          <Text color={'white'}>{totalTransaction} Transaksi</Text>
        </View>
      </View>
    </>
  );
};

// const styles = StyleSheet.create({
//   wave: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//   },
//   icon: {
//     marginLeft: 15,
//   },
// });
