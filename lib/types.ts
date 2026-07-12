// Shared TypeScript types for EcoPoin
// Used across API routes, pages, and components

export interface TrashCategory {
  id: number;
  name: string;
  point_per_unit: number;
}

export interface Profile {
  id: string;
  full_name: string;
  email?: string;
  phone_number?: string;
  location?: string;
  role: "user" | "admin";
  total_points: number;
}

export type TransactionType = "ecopick" | "ecodrop" | "withdraw";
export type TransactionStatus = "pending" | "completed" | "cancelled";

export interface Transaction {
  id: number;
  user_id: string;
  type: TransactionType;
  status: TransactionStatus;
  trash_category_id?: number;
  weight?: number;
  total_points: number;
  reference_number?: string;
  location_address?: string;
  latitude?: number | null;
  longitude?: number | null;
  pickup_datetime?: string;
  notes?: string;
  photo_url?: string | null;
  created_at: string;
  // Joined fields
  profiles?: { full_name: string } | null;
  trash_categories?: { name: string } | null;
  category_name?: string;
}

// API request/response types
export interface ApproveTransactionRequest {
  transactionId: number;
  action: "completed" | "cancelled";
  transactionType: TransactionType;
}

export interface WithdrawRequest {
  ewallet: string;
  phone: string;
  accountName: string;
  amount: number;
}
