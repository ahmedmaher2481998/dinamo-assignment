import { Module } from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { Vendor, VendorSchema } from './Vendor.Schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: Vendor.name, schema: VendorSchema }])],
  providers: [VendorsService],
  exports: [MongooseModule]
})
export class VendorsModule { }
