import React, {ReactNode} from 'react';
import {View} from 'native-base';

type ContainerProps = {
  children: ReactNode;
};

const Container: React.FC<ContainerProps> = ({children}) => {
  return (
    <View flex={1} mx={4}>
      {children}
    </View>
  );
};

export default Container;
