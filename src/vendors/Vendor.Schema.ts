import * as bcrypt from 'bcrypt'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  IsArray,
  IsBoolean,
  IsEmail, IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength, Min,
  MinLength
} from 'class-validator';
import { Document, HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Product } from "../products/Product.Schema"
export type VendorDocument = HydratedDocument<Vendor>;

@Schema({ timestamps: true })
export class Vendor extends Document {
  @Prop({ required: true })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  companyName: string;

  @Prop({ required: true, unique: true })
  @IsEmail()
  businessEmail: string;

  @Prop({ required: true })
  @IsString()
  @MinLength(8)
  password: string;

  @Prop({ required: true })
  @IsString()
  address: string;

  @Prop({ default: null })
  hashRT: string

  @Prop({ default: false })
  @IsBoolean()
  isVerified: boolean;

  @Prop()
  @IsOptional()
  @IsUrl()
  website?: string;

  @Prop({ default: 0 })
  @IsNumber()
  @Min(0)
  rating: number;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Product' }] })
  @IsArray()
  products: Product[];
}
export const VendorSchema = SchemaFactory.createForClass(Vendor);
VendorSchema.pre('save', async function (next) {
  try {
    if (this.password && this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 14);
    }
    next();
  } catch (err) {
    next(err);
  }
});
VendorSchema.index({ companyName: 1, businessEmail: 1 });