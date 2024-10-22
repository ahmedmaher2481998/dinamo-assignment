
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  IsDate,
  IsNumber,
  Min
} from 'class-validator';
import { Document, HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { User } from '../users/User.Schema';
import { Product } from '../products/Product.Schema';
export type CartDocument = HydratedDocument<Cart>;
// Cart Schema
@Schema({ timestamps: true })
export class Cart extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop([{
    product: { type: MongooseSchema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 }
  }])
  items: {
    product: Product;
    quantity: number;
    price: number;
  }[];

  @Prop({ default: 0 })
  @IsNumber()
  @Min(0)
  totalAmount: number;

  @Prop({ default: Date.now })
  @IsDate()
  lastUpdated: Date;
}
const CartSchema = SchemaFactory.createForClass(Cart)

CartSchema.pre('save', function (next) {
  // Calculate total amount
  this.totalAmount = this.items.reduce((sum, item) =>
    sum + (item.price * item.quantity), 0);
  next();
});
