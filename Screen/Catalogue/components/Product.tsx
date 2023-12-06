import React, {FunctionComponent} from 'react';
import {ProductModel} from '../../../models/ProductModel';
import {HStack, Image, Switch, Text, useToast, View} from 'native-base';
import FastImage from 'react-native-fast-image';
import noImage from '../../../Public/Assets/no-Image.jpg';
import RupiahFormatter from '../../../Components/Rupiah/Rupiah';
import ProductNetwork from '../../../Network/lib/product';
import Toast from '../../../Components/Toast/Toast';

type ProductProps = {
  product: ProductModel;
};

const Product: FunctionComponent<ProductProps> = ({product}) => {
  const toast = useToast();
  const changeStatusProduct = (status: boolean) => {
    if (!status) {
      ProductNetwork.deleteProduct({
        id: product.id,
      }).then(() => {
        Toast(toast, 'sukses', 'item deleted successfully');
      });
    } else {
      ProductNetwork.restoreProduct({
        id: product.id,
      }).then(() => {
        Toast(toast, 'sukses', 'item restored successfully');
      });
    }
  };

  return (
    <React.Fragment key={`product-id-${product.id}`}>
      <View bg="white" borderRadius={10}>
        <HStack>
          <View>
            {product.photos && product.photos.length > 0 ? (
              <FastImage
                style={styles.image}
                source={{
                  uri: product.photos[0].original_url,
                  priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.contain}
                fallback={noImage}
              />
            ) : (
              <Image
                source={noImage}
                alt={'foto-produk'}
                style={styles.image}
                resizeMode="contain"
              />
            )}
          </View>
          <View mx={4} my={4}>
            <Text>
              #{product.code} - {product.name}
            </Text>
            <Text>{RupiahFormatter(product.price)}</Text>
          </View>
          <View
            flex={1}
            my={4}
            justifyContent={'flex-end'}
            alignItems={'flex-end'}>
            <Switch
              defaultIsChecked={product.deleted_at === null}
              colorScheme={'primary'}
              onValueChange={value => changeStatusProduct(value)}
              size="lg"
            />
          </View>
        </HStack>
      </View>
    </React.Fragment>
  );
};

export default Product;

const styles = {
  image: {
    width: 130,
    height: 130,
  },
};
