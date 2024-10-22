import { Module } from '@nestjs/common';
import { VendorService } from './vendors.service';
import { Vendor, VendorSchema } from './Vendor.Schema';
import { MongooseModule } from '@nestjs/mongoose';
import { VendorController } from './vendors.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Vendor.name, schema: VendorSchema }])],
  providers: [VendorService],
  exports: [MongooseModule],
  controllers: [VendorController]
})
export class VendorsModule { }
