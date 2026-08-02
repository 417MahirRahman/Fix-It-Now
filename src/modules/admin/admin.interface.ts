export interface IUpdateUserStatus {
  status: "Active" | "Banned";
}

export interface ICreateCategory {
  category_name: string;
}

export interface IAdminStatistics {
  totalUsers: number;
  totalCustomers: number;
  totalTechnicians: number;
  totalBookings: number;
  bookingsByStatus: Record<string, number>;
  totalCategories: number;
  totalRevenue: number;
  totalPayments: number;
}