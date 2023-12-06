import {Box, Text, useToast} from 'native-base';
import React from 'react';
type AlertType = 'success' | 'info' | 'warning' | 'error';

const useAlert = () => {
  const toast = useToast();

  const successColor = '#4CAF50'; // Green
  const infoColor = '#2196F3'; // Blue
  const warningColor = '#FFC107'; // Yellow/Orange
  const errorColor = '#FF5252'; // Red

  const getBackground = (type: AlertType) => {
    var color = '';
    switch (type) {
      case 'success':
        color = successColor;
        break;
      case 'info':
        color = infoColor;
        break;
      case 'warning':
        color = warningColor;
        break;
      case 'error':
        color = errorColor;
        break;
    }

    return color;
  };

  const showAlert = (type: AlertType, message: string) => {
    toast.show({
      placement: 'bottom',
      render: () => (
        <Box bg={getBackground(type)} px="2" py="1" rounded="sm" mb={5}>
          <Text bold color="white">
            {message}
          </Text>
        </Box>
      ),
    });
  };

  return {
    showAlert,
  };
};

export default useAlert;
