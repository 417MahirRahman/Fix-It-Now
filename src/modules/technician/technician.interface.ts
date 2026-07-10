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
  categoryId: string;
}

export interface IUpdateService {
  service_name?: string;
  price?: number;
  categoryId?: string;
}

export interface ICreateAvailability {
  dayOfWeek: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
  startTime: string;
  endTime: string;
}

export interface IUpdateAvailability {
  dayOfWeek?: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
  startTime?: string;
  endTime?: string;
}
