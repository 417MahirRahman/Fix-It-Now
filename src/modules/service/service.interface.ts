export interface IServiceFilters {
  type?: string;
  rating?: number;
}

export interface ICreateService {
  technicianId: string;
  categoryId: string;
  title: string;
  description?: string;
  price: number;
}
