import React from 'react';
import {HStack, Spinner, Heading} from 'native-base';
import {useLoading} from '../../Context'; // Adjust the import path

const LoaderFooter: React.FC = () => {
  const {loading} = useLoading();
  if (loading) {
    return (
      <HStack mt={5} space={2} justifyContent="center">
        <Spinner color={'#A72185'} accessibilityLabel="Loading posts" />
        <Heading color="#A72185" fontSize="md">
          Loading
        </Heading>
      </HStack>
    );
  }
  return null;
};

export default LoaderFooter;
