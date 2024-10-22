
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNumber,
  IsString,
  IsUrl,
  MaxLength, Min,
  MinLength
} from 'class-validator';
import { Document, HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Vendor } from '@/vendors/Vendor.Schema';
export type ProductDocument = HydratedDocument<Product>;

//  Schema
@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @Prop({ required: true })
  @IsString()
  @MinLength(20)
  @MaxLength(1000)
  description: string;

  @Prop({ required: true })
  @IsNumber()
  @Min(0)
  price: number;

  @Prop({ required: true })
  @IsNumber()
  @Min(0)
  stock: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Vendor', required: true })
  vendor: Vendor;

  @Prop({ required: true })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  categories: string[];

  @Prop({ default: true })
  @IsBoolean()
  isActive: boolean;

  @Prop({ type: [String] })
  @IsArray()
  @IsUrl({}, { each: true })
  images: string[];

  @Prop({ default: 0 })
  @IsNumber()
  @Min(0)
  averageRating: number;

}

export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.pre('save', function (next) {
  if (this.isModified('price')) {
    // Round to 2 decimal places
    this.price = Math.round(this.price * 100) / 100;
  }
  next();
});
ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ vendor: 1, categories: 1 });
