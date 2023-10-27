import {Divider, ScrollView, Text, View} from 'native-base';
import React, {createElement, useContext} from 'react';
import NavBar from '../../Components/Navbar/Navbar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Pressable} from 'react-native';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {settingsData} from '../../Util/data';
import useUserInfo from '../../Hooks/useUserInfo';
import {PrimaryColorContext} from '../../Context';

const SettingScreen = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const {userData} = useUserInfo();
  const primaryColor = useContext(PrimaryColorContext);
  return (
    <>
      <NavBar msg="Pengaturan" />
      <ScrollView>
        <View borderRadius={10} p={4} bg={'white'} mx={4} my={4}>
          <View
            mx={4}
            borderRadius={14}
            borderTopColor={'gray.200'}
            bg={'#4d5161'}>
            <View my={4}>
              <Text mx={4} fontSize={'lg'} color={'white'} bold>
                {userData?.business?.name}
              </Text>
              <Text color={'#abafcc'} mx={4}>
                <Ionicons name="location" size={15} color="#abafcc" />{' '}
                {`${(userData?.business?.lat, userData?.business?.lng)}`}
              </Text>
            </View>
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
          Pengaturan Usaha
        </Text>

        <View bg={'white'} mx={4} borderRadius={10}>
          {settingsData.map(item => {
            return (
              <Pressable
                key={item?.id}
                onPress={() =>
                  item?.permission.includes(
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
          Lainnya
        </Text>
        <Pressable onPress={() => navigation.navigate('LogoutScreen')}>
          <View borderRadius={10} p={4} bg={'white'} mx={4} my={2}>
            <View flexDirection={'row'}>
              <View justifyContent={'center'} alignItems={'flex-start'} ml={4}>
                <View bg={'#ffeceb'} p={2} borderRadius={8}>
                  <MaterialIcons name="logout" size={15} color="#e4382f" />
                </View>
              </View>
              <View ml={4} flex={8}>
                <Text bold>Keluar</Text>
                <Text>Pastikan aktifitasmu sudah selesai</Text>
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
    </>
  );
};

export default SettingScreen;
