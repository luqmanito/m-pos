import {Button, Divider, ScrollView, Text, View} from 'native-base';
import React, {createElement, useContext, useState} from 'react';
import NavBar from '../../Components/Navbar/Navbar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import noImage from '../../Public/Assets/no-Image.jpg';
import {Pressable} from 'react-native';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {settingsData, settingsEnData} from '../../Util/data';
import useUserInfo from '../../Hooks/useUserInfo';
import {PrimaryColorContext} from '../../Context';
import FastImage from 'react-native-fast-image';
import {StyleSheet} from 'react-native';
import {Linking} from 'react-native';
import {useTranslation} from 'react-i18next';
import i18next from '../../services/i18next';
import LanguageModal from '../../Components/Language/LanguageModal';

const SettingScreen = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const {userData} = useUserInfo();
  const primaryColor = useContext(PrimaryColorContext);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const goToLocation = async () => {
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${userData?.business?.lat},${userData?.business?.lng}`;

    const isChromeAvailable = await Linking.canOpenURL('googlechrome://');

    if (isChromeAvailable) {
      await Linking.openURL(`googlechrome://navigate?url=${mapUrl}`);
    } else {
      await Linking.openURL(mapUrl);
    }
  };

  const logout = () => {
    navigation.navigate('LogoutScreen');
  };
  const {t} = useTranslation();
  const currentLanguage = i18next.language;
  const settingsToMap =
    currentLanguage === 'en' ? settingsEnData : settingsData;
  return (
    <>
      <NavBar msg={t('settings')} />
      <ScrollView>
        <View borderRadius={10} p={4} bg={'white'} mx={4} my={4}>
          <View
            flexDirection={'row'}
            alignItems={'center'}
            mx={4}
            p={4}
            borderRadius={14}
            borderTopColor={'gray.200'}
            bg={'#4d5161'}>
            {userData?.business?.photo[0]?.original_url ? (
              <View mr={2} overflow={'hidden'}>
                <FastImage
                  style={styles.image}
                  source={{
                    uri: userData?.business?.photo[0]?.original_url,
                    priority: FastImage.priority.normal,
                  }}
                  resizeMode={FastImage.resizeMode.contain}
                  fallback={noImage}
                />
              </View>
            ) : null}
            <Text color={'white'} fontSize={'lg'} bold>
              {userData?.business?.name}
            </Text>
            <Button
              onPress={() => goToLocation()}
              borderRadius={20}
              bg={primaryColor?.primaryColor}
              mx={4}>
              <View flexDirection={'row'} alignItems={'center'}>
                <Ionicons
                  name="location"
                  style={styles.icon}
                  size={20}
                  color="white"
                />
                <Text color={'white'}>{t('location')}</Text>
              </View>
            </Button>
          </View>
          <View mt={4} flexDirection={'row'}>
            <View ml={4} justifyContent={'center'} alignItems={'flex-start'}>
              <View bg={primaryColor?.secondaryColor} p={2} borderRadius={8}>
                <FontAwesome
                  name="user"
                  size={15}
                  color={primaryColor?.primaryColor}
                />
              </View>
            </View>
            <View ml={4} flex={8}>
              <Text bold>{userData?.name}</Text>
              <Text>{userData?.role}</Text>
            </View>
            <View justifyContent={'center'} alignItems={'center'} mr={4}>
              <AntDesign
                name="right"
                size={15}
                color={primaryColor?.primaryColor}
              />
            </View>
          </View>
        </View>

        <Text bold mx={4} mb={2} fontSize={'xl'}>
          {t('business-setting')}
        </Text>
        <View bg={'white'} mx={4} borderRadius={10}>
          {settingsToMap.map(item => {
            return (
              <Pressable
                key={item?.id}
                onPress={() =>
                  item?.icon === 'language'
                    ? setLanguageModalVisible(true)
                    : item?.permission.includes(
                        userData?.role ? userData?.role : '',
                      )
                    ? navigation.navigate(item?.screen)
                    : null
                }>
                <View mt={4} mx={4} flexDirection={'row'}>
                  <View
                    justifyContent={'center'}
                    alignItems={'flex-start'}
                    ml={4}>
                    <View
                      bg={
                        item?.permission.includes(
                          userData?.role ? userData?.role : '',
                        )
                          ? item?.bg
                          : '#f5f4fb'
                      }
                      p={2}
                      borderRadius={8}>
                      {createElement(
                        item?.iconElement,
                        {
                          name: item?.icon,
                          size: 15,
                          color: item?.permission.includes(
                            userData?.role ? userData?.role : '',
                          )
                            ? item?.iconColor
                            : '#afb6d3',
                        },
                        '',
                      )}
                    </View>
                  </View>
                  <View ml={4} flex={8}>
                    <Text
                      color={
                        item?.permission.includes(
                          userData?.role ? userData?.role : '',
                        )
                          ? 'black'
                          : '#b5b3c9'
                      }
                      bold>
                      {item?.title}
                    </Text>
                    <Text
                      color={
                        item?.permission.includes(
                          userData?.role ? userData?.role : '',
                        )
                          ? 'black'
                          : '#b5b3c9'
                      }>
                      {item?.description}
                    </Text>
                  </View>
                  <View justifyContent={'center'} alignItems={'center'} mr={4}>
                    <AntDesign
                      name="right"
                      size={15}
                      color={primaryColor?.primaryColor}
                    />
                  </View>
                </View>
                <View mx={4} mt={4}>
                  {item?.divider ? <Divider /> : null}
                </View>
              </Pressable>
            );
          })}
        </View>

        <Text bold mx={4} mt={4} fontSize={'xl'}>
          {t('other')}
        </Text>
        <Pressable onPress={logout}>
          <View borderRadius={10} p={4} bg={'white'} mx={4} my={2}>
            <View flexDirection={'row'}>
              <View justifyContent={'center'} alignItems={'flex-start'} ml={4}>
                <View bg={'#ffeceb'} p={2} borderRadius={8}>
                  <MaterialIcons name="logout" size={15} color="#e4382f" />
                </View>
              </View>
              <View ml={4} flex={8}>
                <Text bold>{t('logout')}</Text>
                <Text>{t('logout-info')}</Text>
              </View>
              <View justifyContent={'center'} alignItems={'center'} mr={4}>
                <AntDesign
                  name="right"
                  size={15}
                  color={primaryColor?.primaryColor}
                />
              </View>
            </View>
          </View>
        </Pressable>
      </ScrollView>
      <LanguageModal
        visible={languageModalVisible}
        onClose={() => setLanguageModalVisible(false)}
      />
    </>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'white',
  },
  icon: {
    marginRight: 8,
  },
});
