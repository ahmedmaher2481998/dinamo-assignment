
import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  BadRequestException
} from '@nestjs/common';
import { VendorService } from './vendors.service';
import { CreateVendorDto, PaginationQuery, UpdateVendorDto } from '@/types';
import { VendorGuard } from '@/auth/guards/Vendor.guard';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('vendors')
@Controller('vendors')
export class VendorController {
  constructor(private readonly vendorService: VendorService) { }

  @Post('register')
  register(@Body() createVendorDto: CreateVendorDto) {
    return this.vendorService.registerVendor(createVendorDto);
  }

  @Get()
  getAllVendors(@Query() query: PaginationQuery) {
    return this.vendorService.getAllVendors(query);
  }

  @Get(':id')
  getVendorProfile(@Param('id') id: string) {
    return this.vendorService.getVendorProfile(id);
  }

  @UseGuards(VendorGuard)
  @Put(':id')
  updateProfile(
    @Param('id') id: string,
    @Body() updateVendorDto: UpdateVendorDto,
    @Request() req
  ) {
    // Ensure vendor can only update their own profile
    if (req.user.vendorId !== id) {
      throw new BadRequestException('You can only update your own profile');
    }
    return this.vendorService.updateVendorProfile(id, updateVendorDto);
  }

  @UseGuards(VendorGuard)
  @Get(':id/stats')
  getStats(@Param('id') id: string) {
    return this.vendorService.getVendorStats(id);
  }

  @UseGuards(VendorGuard)
  @Put(':id/verify')
  verifyVendor(@Param('id') id: string) {
    return this.vendorService.verifyVendor(id);
  }
}