import React from 'react';
import {Flex, Image, View} from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface PhotoInputProps {
  imageCamera?: string;
  setImageCamera: React.Dispatch<React.SetStateAction<string | undefined>>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const PhotoInput: React.FC<PhotoInputProps> = ({
  imageCamera,
  setImageCamera,
  setIsOpen,
}) => {
  return (
    <Flex>
      {imageCamera ? (
        <View width={120} position={'relative'}>
          <Image
            position={'relative'}
            alignItems="flex-end"
            source={{uri: imageCamera}}
            width={100}
            height={120}
            alt="uploaded-image"
          />
          <View
            position={'absolute'}
            top={5}
            mt={-7}
            color={'red.100'}
            right={3}>
            <MaterialIcons
              onPress={() => setImageCamera('')}
              name="cancel"
              size={27}
              color="gray"
            />
          </View>
        </View>
      ) : (
        <MaterialIcons
          onPress={() => setIsOpen(true)}
          name="add-photo-alternate"
          size={45}
          color={'#29B9DC'}
        />
      )}
    </Flex>
  );
};

export default PhotoInput;
