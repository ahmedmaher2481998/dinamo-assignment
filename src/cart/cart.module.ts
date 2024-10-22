import { Module } from '@nestjs/common';
import { CartService } from './cart/cart.service';

@Module({
  providers: [CartService]
})
export class CartModule {}
