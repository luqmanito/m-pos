import {Heading, HStack, Spinner} from 'native-base';
import React from 'react';

export const RenderFooter = () => {
  return (
    <HStack mt={5} space={2} justifyContent="center">
      <Spinner color={'#A72185'} accessibilityLabel="Loading posts" />
      <Heading color="#A72185" fontSize="md">
        Loading
      </Heading>
    </HStack>
  );
};
