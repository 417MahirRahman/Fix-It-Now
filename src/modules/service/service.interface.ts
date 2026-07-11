export interface IServiceFilters {
  type?: string;
  rating?: number;
}

export interface ICreateService {
  service_name: string;
  price: number;
  categoryName: string;
}

export interface IUpdateService {
  service_name?: string;
  price?: number;
  categoryName: string;
}
