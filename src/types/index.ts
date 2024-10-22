// Cart Types
export * from './Cart.types'
// Product Types
export * from './Product.types'
// Vendor Types
export * from './Vendor.types'
// User Types
export * from './User.types'





// Response Types for API
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Query Types
export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface ProductQuery extends PaginationQuery {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  vendorId?: string;
  inStock?: boolean;
}

// Filter Types
export interface DateRangeFilter {
  startDate?: Date;
  endDate?: Date;
}

export interface PriceRangeFilter {
  minPrice?: number;
  maxPrice?: number;
}

// Enum Types
export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

// Error Types
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}