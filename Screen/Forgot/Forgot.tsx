import React, {useState} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AuthNetwork from '../../Network/lib/auth';
import {Center, View, ScrollView, IconButton, Icon, Text} from 'native-base';
import Container from '../../Components/Layout/Container';
import BaseInput from '../../Components/Form/BaseInput';
import useAlert from '../../Hooks/useAlert';
import BaseButton from '../../Components/Button/BaseButton';
import {ErrorModel} from '../../models/ErrorModel';
import useErrorHandler from '../../Hooks/useErrorHandler';
import {NavigationProp} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

type ForgotScreenProps = {
  navigation: NavigationProp<any>;
};

const ForgotScreen: React.FC<ForgotScreenProps> = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const alert = useAlert();
  const {t} = useTranslation();
  const {getFormError, clearFormErrors, setFormErrors, isInvalid} =
    useErrorHandler();
  const handleSubmit = async () => {
    setIsLoading(true);
    clearFormErrors();
    AuthNetwork.forgot({
      email: email,
    })
      .then(() => {
        navigation.navigate('OtpScreen', {
          email: email,
        });
      })
      .catch(e => {
        const err: ErrorModel | undefined = e.response.data;
        setFormErrors(err);
        console.log(err);

        alert.showAlert('error', e.response.data.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onClose = () => {
    navigation.navigate('LoginScreen');
  };

  return (
    <>
      <Container>
        <ScrollView>
          <View mt={5}>
            <Center my={2}>
              <Text fontSize="md" bold>
                {t('forgot-title')}
              </Text>
              <Text mt={2} mb={4} fontSize="sm">
                {t('forgot-info')}
              </Text>
            </Center>
            <IconButton
              icon={<Icon as={MaterialIcons} name="close" />}
              borderRadius="full"
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                padding: 8,
              }}
              onPress={onClose}
            />
          </View>
          <View>
            <BaseInput
              inputKey={'email'}
              isRequired={true}
              label={'Email'}
              keyboardType={'email-address'}
              placeholder={t('example-mail')}
              type={'text'}
              isInvalid={isInvalid('email')}
              warningMessage={getFormError('email')}
              onChangeText={text => setEmail(text)}
            />
            <BaseButton
              type={'primary'}
              mt={4}
              onPress={handleSubmit}
              isLoading={isLoading}
              label={t('submit')}
            />
          </View>
        </ScrollView>
      </Container>
    </>
  );
};
export default ForgotScreen;
