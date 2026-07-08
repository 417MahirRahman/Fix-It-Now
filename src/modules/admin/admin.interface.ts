export interface IUpdateUserStatus {
  status: "Active" | "Banned";
}

export interface ICreateCategory {
  name: string;
  description?: string;
}
