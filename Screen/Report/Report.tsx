import {
  Button,
  Center,
  Divider,
  Icon,
  Input,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'native-base';
import React, {useContext, useState} from 'react';
import NavBar from '../../Components/Navbar/Navbar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import {useReport} from '../../Hooks/useReport';

import {PrimaryColorContext, useLoading} from '../../Context';
import usePaymentSubmit from '../../Hooks/useSubmitPayment';
import formatDateYYYY_MM_DD from '../../Util/Date/FormatYYYY-MM-DD';
import RupiahFormatter from '../../Util/Rupiah/Rupiah';
import {useTranslation} from 'react-i18next';

const ReportScreen = () => {
  const {handleChange, reportDataTotal, pendingOrder, reportDataPayment} =
    useReport();
  const {t} = useTranslation();
  const [selectedRange, setSelectedRange] = useState(1);
  const [selectedRangeName, setSelectedRangeName] = useState(t('today'));
  const [selectedStartDate, setSelectedStartDate] = useState('');
  const [rangeName, setRangeName] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const {loading} = useLoading();
  const {submitPayment} = usePaymentSubmit();
  const primaryColor = useContext(PrimaryColorContext);
  let totalPriceTransaction = 0;
  let totalTransaction = 0;

  if (reportDataTotal) {
    reportDataTotal.forEach(item => {
      totalPriceTransaction += Number(item.total);
      totalTransaction += Number(item?.total_transaction);
    });
  }

  const currentDate = new Date();

  const thirtyDaysAgo = new Date(currentDate);
  thirtyDaysAgo.setDate(currentDate.getDate() - 30);

  const sevenDaysAgo = new Date(currentDate);
  sevenDaysAgo.setDate(currentDate.getDate() - 7);

  const today = formatDateYYYY_MM_DD(currentDate);
  const formattedDate30 = formatDateYYYY_MM_DD(thirtyDaysAgo);
  const formattedDate7 = formatDateYYYY_MM_DD(sevenDaysAgo);

  return (
    <>
      <ScrollView>
        <NavBar msg={t('report')} />
        <View mx={4} mt={4}>
          <Pressable onPress={() => setIsOpen(true)}>
            <Input
              bg={'white'}
              borderRadius={10}
              isReadOnly={true}
              type="text"
              value={selectedRangeName}
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
        <View mt={4} borderRadius={10} bg={'white'} mx={4}>
          <View px={4} mt={4} mb={2} flexDirection={'row'}>
            <View justifyContent="center" flex={1}>
              <Text bold>
                {t('info-pending')} :{' '}
                {pendingOrder?.length ? pendingOrder?.length : '0'}
              </Text>
            </View>
            <View flex={1} alignItems={'flex-end'}>
              <Button
                isLoading={loading}
                isLoadingText={'loading...'}
                onPress={() => submitPayment(pendingOrder)}
                isDisabled={pendingOrder?.length ? false : true}
                borderRadius={20}
                bg={primaryColor?.primaryColor}>
                {t('send-transaction')}
              </Button>
            </View>
          </View>
          <View px={4}>
            <Divider />
          </View>
          <View flexDirection={'row'} mt={4}>
            <Text ml={4} bold>
              {t('total-transaction')}
            </Text>
            <View ml={2}>
              <Entypo name="info-with-circle" size={20} color="#b0b4d8" />
            </View>
          </View>
          <Text mx={4} fontSize={'xl'} bold color={primaryColor?.primaryColor}>
            {RupiahFormatter(totalPriceTransaction)}
          </Text>
          <Text mx={4} my={4} fontSize={'sm'}>
            {totalTransaction} {t('transaction')}
          </Text>
          {reportDataTotal?.map((item, index) => {
            return (
              <React.Fragment key={index}>
                <View
                  shadow={4}
                  bg={'white'}
                  mb={index === reportDataTotal.length - 1 ? 4 : 0}
                  mx={4}
                  mt={4}
                  borderRadius={10}
                  borderColor={'white'}
                  borderWidth={1}
                  flexDirection={'row'}>
                  <View flex={1} justifyContent={'center'} mx={4} my={2}>
                    <Text>{item?.ref}</Text>
                  </View>
                  <View flex={1} mx={4} my={2}>
                    <Text fontSize={'lg'} bold alignSelf={'flex-end'}>
                      {RupiahFormatter(item?.total)}
                    </Text>
                    <Text alignSelf={'flex-end'} color={'#b0b4d8'}>
                      {item?.total_transaction + t('transaction')}
                    </Text>
                  </View>
                </View>
              </React.Fragment>
            );
          })}
        </View>
        <View borderRadius={10} bg={'white'} mx={4} my={4}>
          <Text mx={4} my={4} bold>
            {t('payment-method')}
          </Text>
          {reportDataPayment?.map((item, index) => {
            return (
              <React.Fragment key={index}>
                <View
                  key={index}
                  bg={'gray.100'}
                  mx={4}
                  mt={index === 0 ? 4 : 0}
                  borderTopRadius={index === 0 ? 10 : 0}
                  borderBottomRadius={
                    index === reportDataPayment?.length - 1 ? 10 : 0
                  }
                  borderColor={'white'}
                  borderWidth={1}
                  flexDirection={'row'}>
                  <View flex={1} justifyContent={'center'} mx={4} my={2}>
                    <Text>{item?.name}</Text>
                  </View>
                  <View flex={1} mx={4} my={2}>
                    <Text fontSize={'lg'} bold alignSelf={'flex-end'}>
                      {RupiahFormatter(item?.total)}
                    </Text>
                    <Text alignSelf={'flex-end'}>
                      {item?.total_transaction} {t('transaction')}
                    </Text>
                  </View>
                </View>
                <View
                  mx={4}
                  mb={index === reportDataPayment?.length - 1 ? 4 : null}>
                  {index === reportDataPayment?.length - 1 ? null : <Divider />}
                </View>
              </React.Fragment>
            );
          })}
        </View>
      </ScrollView>
      <Center>
        <Modal size={'full'} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <Modal.Content mt={'auto'} maxWidth="400px">
            <Modal.CloseButton />
            <Modal.Header>
              <Text bold fontSize={'2xl'}>
                {t('income')}
              </Text>
            </Modal.Header>
            <Modal.Body>
              <Pressable
                onPress={() => {
                  setRangeName(t('today'));
                  setSelectedRange(1);
                  setSelectedStartDate(today);
                }}>
                <View flexDirection={'row'}>
                  <Text flex={11} mb={2}>
                    {t('today')}
                  </Text>
                  {selectedRange === 1 ? (
                    <View flex={1} mb={2}>
                      <AntDesign
                        name={'checkcircle'}
                        size={20}
                        color={primaryColor?.primaryColor}
                      />
                    </View>
                  ) : null}
                </View>
              </Pressable>
              <Divider />
              <Pressable
                onPress={() => {
                  setRangeName(t('last7days'));
                  setSelectedRange(2);
                  setSelectedStartDate(formattedDate7);
                }}>
                <View>
                  <View flexDirection={'row'} my={2}>
                    <Text flex={11}>{t('last7days')}</Text>
                    <View flex={1}>
                      {selectedRange === 2 ? (
                        <AntDesign
                          name={'checkcircle'}
                          size={20}
                          color={primaryColor?.primaryColor}
                        />
                      ) : null}
                    </View>
                  </View>
                  <Divider />
                </View>
              </Pressable>
              <Pressable
                onPress={() => {
                  setRangeName(t('last30days'));
                  setSelectedRange(3);
                  setSelectedStartDate(formattedDate30);
                }}>
                <View>
                  <View flexDirection={'row'} my={2}>
                    <Text flex={11}>{t('last30days')}</Text>
                    {selectedRange === 3 ? (
                      <View flex={1}>
                        <AntDesign
                          name={'checkcircle'}
                          size={20}
                          color={primaryColor?.primaryColor}
                        />
                      </View>
                    ) : null}
                  </View>
                  <Divider />
                </View>
              </Pressable>
              <Button
                onPress={() => {
                  setIsOpen(false);
                  setSelectedRangeName(rangeName);
                  handleChange({name: 'start_date', value: selectedStartDate});
                }}
                mt={4}
                borderRadius={34}
                alignItems={'center'}
                justifyContent={'center'}
                bg={primaryColor?.primaryColor}>
                <Text fontSize={'lg'} color="white">
                  {t('set')}
                </Text>
              </Button>
            </Modal.Body>
          </Modal.Content>
        </Modal>
      </Center>
    </>
  );
};

export default ReportScreen;
