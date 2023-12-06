import React, {useState, useEffect} from 'react';
import {Button, Modal, View} from 'native-base';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import {PermissionsAndroid} from 'react-native';
import BaseButton from '../Button/BaseButton';

type LocationPickerProps = {
  onLocationSelect: (
    location: {latitude: number; longitude: number},
    address: string,
  ) => void;
};

const LocationPicker: React.FC<LocationPickerProps> = ({onLocationSelect}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [address, setAddress] = useState('');
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'App needs access to your location.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };
  const getCurrentLocation = async () => {
    const hasLocationPermission = await requestLocationPermission();

    if (hasLocationPermission) {
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          setSelectedLocation({latitude, longitude});
        },
        error => {
          console.log(error.code, error.message);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    } else {
      console.log('Location permission denied.');
    }
  };

  useEffect(() => {
    if (selectedLocation) {
      // Perform reverse geocoding
      reverseGeocode(selectedLocation.latitude, selectedLocation.longitude);
    }
  }, [selectedLocation]);

  const reverseGeocode = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
      );
      const data = await response.json();
      if (data.display_name) {
        setAddress(data.display_name);
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  useEffect(() => {
    getCurrentLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMapPress = (event: {
    nativeEvent: {coordinate: {latitude: number; longitude: number}};
  }) => {
    const {latitude, longitude} = event.nativeEvent.coordinate;
    setSelectedLocation({latitude, longitude});
  };

  const handleConfirm = () => {
    onLocationSelect(selectedLocation, address);
    toggleModal();
  };

  return (
    <View>
      <BaseButton
        type={'primary'}
        onPress={toggleModal}
        label={'Select Location'}
      />

      <Modal isOpen={isModalVisible} onClose={toggleModal}>
        <Modal.Content maxWidth="100%">
          <Modal.CloseButton />
          <Modal.Header>{'Select Location'}</Modal.Header>
          <Modal.Body>
            <MapView
              style={{height: 400}}
              initialRegion={{
                latitude: selectedLocation.latitude,
                longitude: selectedLocation.longitude,
                latitudeDelta: 0.0522,
                longitudeDelta: 0.0421,
              }}
              onPress={handleMapPress}>
              {selectedLocation.latitude !== 0 && (
                <Marker
                  coordinate={{
                    latitude: selectedLocation.latitude,
                    longitude: selectedLocation.longitude,
                  }}
                />
              )}
            </MapView>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <BaseButton
                type={'primary'}
                onPress={handleConfirm}
                label={'Confirm'}
              />
              <BaseButton
                type={'error'}
                onPress={toggleModal}
                label={'Cancel'}
              />
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </View>
  );
};

export default LocationPicker;
