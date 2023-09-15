import {AxiosResponse} from 'axios';
import axiosClient from '../axiosClient';
import {ProductListModel, ProductModel} from '../../models/ProductModel';
import {RootCategoryModel} from '../../models/CategoryModel';
// import {ValidationErrorModel} from '../../models/ValidationErrorModel';

interface RegisterData extends FormData {}

type categoryList = {
  page: number;
};
type productListProps = {
  page: number;
  per_page: number;
  search: string;
  categories?: number;
  withTrashed?: boolean;
};
type productDetailProps = {
  id: number | null;
};

export default {
  create({data}: {data: RegisterData}): Promise<AxiosResponse> {
    return axiosClient('api/products', {
      method: 'POST',
      data: data,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  edit({data, id}: {data: RegisterData; id: number}): Promise<AxiosResponse> {
    return axiosClient(`api/products/${id}`, {
      method: 'POST',
      data: data,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  categoryList({
    page,
  }: categoryList): Promise<AxiosResponse<RootCategoryModel>> {
    return axiosClient.get(`api/categories?per_page=10000&page=${page}`);
  },
  deleteImages({id}: {id: number}): Promise<AxiosResponse> {
    return axiosClient.delete(`api/media/${id}`);
  },
  deleteProduct({id}: {id: number}): Promise<AxiosResponse> {
    return axiosClient.delete(`api/products/${id}`);
  },
  productList({
    page,
    search,
    withTrashed,
    per_page,
    categories,
  }: productListProps): Promise<AxiosResponse<ProductListModel>> {
    return axiosClient.get(
      `api/products?search=${search}&page=${page}&per_page=${per_page}&load=photos${
        withTrashed ? '&withTrashed=' : ''
      }${categories ? `&categories=${categories}` : ''}`,
    );
  },
  productCategoryList(): Promise<AxiosResponse<ProductModel[]>> {
    return axiosClient.get('api/products?load=photos');
  },
  productDetail({
    id,
  }: productDetailProps): Promise<AxiosResponse<ProductModel>> {
    return axiosClient.get(`api/products/${id}?load=photos,category`);
  },
  // productDetailNew(id: number): Promise<ProductModel | undefined> {
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       const request = await axiosClient.get<ProductModel>(
  //         `api/products/${id}?load=photos,category`,
  //       );
  //       if (request.status === 200) {
  //         resolve(request.data);
  //       }
  //     } catch (error) {
  //       if (
  //         axios.isAxiosError<ValidationErrorModel, Record<string, unknown>>(
  //           error,
  //         )
  //       ) {
  //         const err: ValidationErrorModel | undefined = error.response?.data;
  //         reject(err);
  //       } else {
  //         console.error(error);
  //         reject(error);
  //       }
  //     }
  //   });
  // },
};
