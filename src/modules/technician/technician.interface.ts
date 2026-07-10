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
