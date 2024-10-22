import { TimestampFieldsType } from "./Timestamp.types";
import { VendorResponse } from "./Vendor.types";

export type ProductType = {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  vendor: string; // Vendor ID
  categories: string[];
  isActive: boolean;
  images: string[];
  averageRating: number;
} & TimestampFieldsType

export type CreateProductDto = Omit<ProductType, '_id' | 'averageRating' | keyof TimestampFieldsType> & {
  vendorId: string;
};

export type UpdateProductDto = Partial<Omit<ProductType, '_id' | 'vendor' | keyof TimestampFieldsType>>;

export type ProductResponse = ProductType & {
  vendor: VendorResponse;
};
