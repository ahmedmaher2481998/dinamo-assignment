import { ProductsModule } from '@/products/products.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './Cart.Schema';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]), ProductsModule],
  providers: [CartService],
  controllers: [CartController],
  exports: [MongooseModule]
})
export class CartModule { }
