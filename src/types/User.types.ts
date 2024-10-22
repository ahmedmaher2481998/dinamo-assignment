import { TimestampFieldsType } from "./Timestamp.types";

export type UserType = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isVerified: boolean;
  role: 'user' | 'admin';
  lastLogin: Date;
} & TimestampFieldsType

export type CreateUserDto = Omit<UserType, '_id' | 'isVerified' | 'lastLogin' | keyof TimestampFieldsType>;

export type UpdateUserDto = Partial<Omit<UserType, '_id' | 'email' | 'password' | keyof TimestampFieldsType>>;

export type UserResponse = Omit<UserType, 'password'>;
