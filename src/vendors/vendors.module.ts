import { Module } from '@nestjs/common';
import { VendorService } from './vendors.service';
import { Vendor, VendorSchema } from './Vendor.Schema';
import { MongooseModule } from '@nestjs/mongoose';
import { VendorController } from './vendors.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({}), MongooseModule.forFeature([{ name: Vendor.name, schema: VendorSchema }])],
  providers: [VendorService],
  exports: [MongooseModule],
  controllers: [VendorController]
})
export class VendorsModule { }
