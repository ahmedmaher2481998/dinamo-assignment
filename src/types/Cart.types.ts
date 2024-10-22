import { ProductResponse } from "./Product.types";
import { TimestampFieldsType } from "./Timestamp.types";

export interface ICartItem {
  product: string; // Product ID
  quantity: number;
  price: number;
}

export type ICart = {
  _id: string;
  user: string; // User ID
  items: ICartItem[];
  totalAmount: number;
  lastUpdated: Date;
} & TimestampFieldsType

export type CreateCartItemDto = {
  productId: string;
  quantity: number;
};

export type UpdateCartItemDto = {
  quantity: number;
};

export type CartResponse = Omit<ICart, 'user'> & {
  items: (Omit<ICartItem, 'product'> & {
    product: ProductResponse;
  })[];
};