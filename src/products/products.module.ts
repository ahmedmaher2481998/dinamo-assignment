import { Module } from '@nestjs/common';
import { ProductService } from './products.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './Product.Schema';
import { ProductController } from './products.controller';
import { Vendor, VendorSchema } from '@/vendors/Vendor.Schema';


const models = [{ name: Product.name, schema: ProductSchema }, { name: Vendor.name, schema: VendorSchema }]

@Module({
  imports: [MongooseModule.forFeature(models)],
  providers: [ProductService],
  exports: [MongooseModule, ProductService],
  controllers: [ProductController]
})
export class ProductsModule { }
