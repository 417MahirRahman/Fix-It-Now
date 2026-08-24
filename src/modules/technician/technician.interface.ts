export interface ITechnicianFilters {
  type?: string;
  location?: string;
  rating?: number;
}

export interface IUpdateTechnicianProfile {
  bio?: string;
  experienceYears?: number;
}

export interface IUpdateBookingStatus {
  status: "Accepted" | "Declined" | "InProgress" | "Completed";
}

export interface ICreateService {
  service_name: string;
  price: number;
  categoryName: string;
}

export interface IUpdateService {
  service_name?: string;
  price?: number;
}

export interface ICreateAvailability {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

export interface IUpdateAvailability {
  dayOfWeek?: string;
  startTime?: string;
  endTime?: string;
}
