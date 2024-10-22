import { TimestampFieldsType } from "./Timestamp.types";

export type VendorType = {
  _id: string;
  companyName: string;
  businessEmail: string;
  password: string;
  address: string;
  isVerified: boolean;
  website?: string;
  rating: number;
  products: string[]; // Array of Product IDs
} & TimestampFieldsType

export type CreateVendorDto = Omit<VendorType, '_id' | 'isVerified' | 'rating' | 'products' | keyof TimestampFieldsType>;

export type UpdateVendorDto = Partial<Omit<VendorType, '_id' | 'businessEmail' | 'password' | 'products' | keyof TimestampFieldsType>>;

export type VendorResponse = Omit<VendorType, 'password'>;