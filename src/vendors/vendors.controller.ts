
import { isPublic } from '@/auth/decorators';
import { VendorGuard } from '@/auth/guards/Vendor.guard';
import { CreateVendorDto, PaginationQuery, UpdateVendorDto } from '@/types';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { VendorService } from './vendors.service';
import { authDto, signinDto } from '@/auth/dto';
@ApiTags('vendors')
@Controller('vendors')
export class VendorController {
  constructor(private readonly vendorService: VendorService) { }

  @isPublic()
  @Post('register')
  register(@Body() createVendorDto: CreateVendorDto) {
    return this.vendorService.registerVendor(createVendorDto);
  }

  @Get()
  @isPublic()
  getAllVendors(@Query() query: PaginationQuery) {
    return this.vendorService.getAllVendors(query);
  }

  @Get(':id')
  @isPublic()
  getVendorProfile(@Param('id') id: string) {
    return this.vendorService.getVendorProfile(id);
  }

  @Post('logout')
  @UseGuards(VendorGuard)
  logOut(@Request() req) {
    return this.vendorService.logOut(req.user['sub']);
  }


  @UseGuards(VendorGuard)
  @Put(':id')
  updateProfile(
    @Param('id') id: string,
    @Body() updateVendorDto: UpdateVendorDto,
    @Request() req
  ) {
    // vendor can only update their profile
    if (req.user['sub'] !== id) {
      throw new BadRequestException('You can only update your own profile');
    }
    return this.vendorService.updateVendorProfile(id, updateVendorDto);
  }

  @isPublic()
  @Post('sign-in')
  loginUser(@Body() authBody: signinDto) {
    return this.vendorService.loginVendor(authBody.email, authBody.password);
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