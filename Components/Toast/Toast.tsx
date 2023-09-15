import React from 'react';
import {Box, Text} from 'native-base';

const ToastAlert = (toast: any, value: string, msg: string) => {
  toast.show({
    placement: 'bottom',
    render: () => (
      <Box
        bg={value === 'sukses' ? 'emerald.500' : 'red.500'}
        px="2"
        py="1"
        rounded="sm"
        mb={5}>
        <Text bold color="white">
          {msg}
        </Text>
      </Box>
    ),
  });
};

export default ToastAlert;
