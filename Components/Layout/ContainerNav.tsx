import React, {ReactNode} from 'react';
import {View} from 'native-base';

type ContainerProps = {
  children: ReactNode;
};

const ContainerNav: React.FC<ContainerProps> = ({children}) => {
  return (
    <View flex={1} mb={170} mx={4}>
      {children}
    </View>
  );
};

export default ContainerNav;
