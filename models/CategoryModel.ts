import {MetaModel} from './MetaModel';

export interface CategoryModel {
  id: number;
  business_id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  deleted_at: any;
}

export interface RootCategoryModel {
  data: CategoryModel[];
  meta: MetaModel;
}
