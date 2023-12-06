import React from 'react';
import {FlatList, Text, View} from 'native-base';
import Empty from '../../Components/Content/Empty';
import useCategories from '../../Hooks/useCategory';
import {useLoading} from '../../Context';
import SkeletonLoader from '../../Components/Skeleton/SkeletonLoader';
import LoaderFooter from '../../Components/Footer/LoaderFooter';
import {ListRenderItem} from 'react-native';
import {CategoryModel} from '../../models/CategoryModel';
import Search from '../../Components/Form/Search';

const ListCategory = () => {
  const {categories, newFetchData, handleRefresh, searchCategory} =
    useCategories();
  const {loading} = useLoading();

  const renderItem: ListRenderItem<CategoryModel> = ({item, index}) => (
    <View
      flex={1}
      mr={index % 2 === 0 ? 10 : null}
      my={2}
      key={`category-${item.id}-${index}`}>
      <View my={4}>
        <Text fontSize={'lg'}>{item.name}</Text>
        <Text fontSize={'sm'} color={'coolGray.500'}>
          {item.description}
        </Text>
      </View>
      <View bg={'coolGray.300'} h={0.5} />
    </View>
  );

  return (
    <View>
      <View>
        <Search
          search={text => {
            searchCategory(text);
          }}
        />
      </View>
      {loading ? (
        <SkeletonLoader skeletonCount={10} />
      ) : categories?.length > 0 ? (
        <FlatList
          key={'category-list'}
          data={categories}
          renderItem={renderItem}
          keyExtractor={item => `category-item-${item.id.toString()}`}
          numColumns={1}
          ListFooterComponent={<LoaderFooter />}
          onRefresh={handleRefresh}
          refreshing={false}
          onEndReached={newFetchData}
          onEndReachedThreshold={10}
          mt={2}
        />
      ) : (
        <Empty
          title={'Yuk, Tambah Kategori Jualanmu'}
          showIMage={true}
          subtitle={'Semua Kategori yang kamu miliki bisa diatur dari sini'}
        />
      )}
    </View>
  );
};

export default ListCategory;
