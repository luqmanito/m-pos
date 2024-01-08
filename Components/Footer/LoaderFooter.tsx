import React from 'react';
import {HStack, Spinner, Heading} from 'native-base';

const LoaderFooter: React.FC = () => {
  return (
    <HStack mt={5} space={2} justifyContent="center">
      <Spinner color={'#A72185'} accessibilityLabel="Loading posts" />
      <Heading color="#A72185" fontSize="md">
        Loading
      </Heading>
    </HStack>
  );
  // }
  // return null;
};

export default LoaderFooter;
