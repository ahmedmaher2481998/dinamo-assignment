import { Module } from '@nestjs/common';
import { ProductService } from './products.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './Product.Schema';
import { ProductController } from './products.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }])],
  providers: [ProductService],
  exports: [MongooseModule],
  controllers: [ProductController]
})
export class ProductsModule { }
