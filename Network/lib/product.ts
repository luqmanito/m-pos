import {AxiosResponse} from 'axios';
import axiosClient from '../axiosClient';
import {ProductListModel, ProductModel} from '../../models/ProductModel';
import {ErrorModel} from '../../models/ErrorModel';

type productDetailProps = {
  id: number | null;
};

export default {
  create(formData: FormData): Promise<ProductModel> {
    return new Promise((resolve, reject) => {
      axiosClient
        .post<ProductModel>('api/products', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(({data}) => {
          resolve(data);
        })
        .catch(e => {
          const err: ErrorModel | undefined = e.response.data;
          console.log(err);

          reject(err);
        });
    });
  },

  edit({
    formData,
    id,
  }: {
    formData: FormData;
    id: number | null | undefined;
  }): Promise<ProductModel> {
    return new Promise((resolve, reject) => {
      axiosClient
        .post<ProductModel>(`api/products/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(({data}) => {
          resolve(data);
        })
        .catch(e => {
          const err: ErrorModel | undefined = e.response.data;
          console.log(err);

          reject(err);
        });
    });
  },

  deleteImages({id}: {id: number}): Promise<AxiosResponse> {
    return axiosClient.delete(`api/media/${id}`);
  },
  deleteProduct({id}: {id: number}): Promise<AxiosResponse> {
    return axiosClient.delete(`api/products/${id}`);
  },
  productList(data: any): Promise<AxiosResponse<ProductListModel>> {
    return axiosClient.get('api/products', {
      params: data,
    });
  },
  restoreProduct({id}: {id: number}): Promise<AxiosResponse> {
    return axiosClient.put(`api/products/${id}/restore`);
  },

  productDetail({
    id,
  }: productDetailProps): Promise<AxiosResponse<ProductModel>> {
    return axiosClient.get(`api/products/${id}`, {
      params: {
        load: 'photos,category',
      },
    });
  },
};
