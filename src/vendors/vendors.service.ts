import { Injectable, NotFoundException, ConflictException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Vendor } from './Vendor.Schema';
import { BaseCrudService } from '@/shared/BaseCrud.abstract';
import { hash } from 'bcrypt';
import {
  VendorType,
  CreateVendorDto,
  UpdateVendorDto,
  VendorResponse,
  ApiResponse,
  PaginatedResponse,
  PaginationQuery
} from '@/types';
import { token } from '@/auth/types';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class VendorService extends BaseCrudService<Vendor> {
  constructor(
    @InjectModel(Vendor.name) private vendorModel: Model<Vendor>,
    private jwtService: JwtService
  ) {
    super(vendorModel);
  }

  private async hashData(data: string): Promise<string> {
    return hash(data, 14);
  }

  private formatVendorResponse(vendor: VendorType): VendorResponse {
    const { password, ...vendorResponse } = vendor;
    return vendorResponse;
  }

  async loginVendor(email: string, password: string): Promise<token & ApiResponse<VendorResponse>> {
    const vendor = await this.vendorModel.findOne({
      businessEmail: email,
    }, { password: 1, businessEmail: 1 });
    if (!vendor) throw new ForbiddenException('Access Denied');
    const isPassMatch = bcrypt.compareSync(password, vendor.password)

    if (!isPassMatch) throw new ForbiddenException('Access Denied');
    const { access_token, refresh_token } = await this.getTokens(vendor.id, vendor.businessEmail);
    await this.updateRtHash(vendor.id, refresh_token);
    const vendorData: Vendor = await this.vendorModel.findOne({
      businessEmail: email,
    }, { password: 0, hashedRT: 0 });
    return {
      access_token, refresh_token,
      data: this.formatVendorResponse(vendorData.toObject()),
      success: true, message: "sign in success"
    }
  }


  async registerVendor(createDto: CreateVendorDto): Promise<ApiResponse<VendorResponse> & token> {
    try {
      // Check if vendor already exists
      const existingVendor = await this.vendorModel.findOne({
        businessEmail: createDto.businessEmail
      });

      if (existingVendor) {
        throw new ConflictException('Vendor with this email already exists');
      }

      // Create vendor
      const vendor = await super.create({
        ...createDto,
        password: createDto.password, // pre-saved hash (Hook)
        isVerified: false,
        rating: 0,
        products: []
      });
      const { access_token, refresh_token } = await this.getTokens(vendor.id, vendor.businessEmail)

      await this.updateRtHash(vendor.id, refresh_token)
      return {
        success: true,
        message: 'Vendor registered successfully',
        data: this.formatVendorResponse(vendor.toObject()),
        refresh_token,
        access_token
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Failed to register vendor' + error.message);
    }
  }

  async getVendorProfile(id: string): Promise<ApiResponse<VendorResponse>> {
    try {
      const vendor: Vendor = await this.vendorModel.findById(id);

      return {
        success: true,
        data: this.formatVendorResponse(vendor.toObject())
      };
    } catch (error) {
      throw new NotFoundException('Vendor not found');
    }
  }

  async getAllVendors(query: PaginationQuery): Promise<ApiResponse<PaginatedResponse<VendorResponse>>> {

    const { page = 1, limit = 10, sort = 'rating', order = 'desc' } = query;
    const skip = (page - 1) * limit;

    try {
      const [vendors, total] = await Promise.all([
        this.vendorModel
          .find()
          .sort({ [sort]: order === 'desc' ? -1 : 1 })
          .skip(skip)
          .limit(limit)
          .exec(),
        this.vendorModel.countDocuments()
      ]);

      const formattedVendors = vendors.map((vendor: Vendor) =>

        this.formatVendorResponse(vendor.toObject())
      );

      return {
        success: true,
        data: {
          items: formattedVendors,
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new BadRequestException('Failed to fetch vendors');
    }
  }
  async getTokens(id: string, email: string): Promise<token> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: id,
          email,
        },
        {
          expiresIn: 15 * 60,
          secret: process.env.JWT_SECRET_AT,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: id,
          email,
        },
        {
          expiresIn: 60 * 60 * 24 * 7,
          secret: process.env.JWT_SECRET_RT,
        },
      ),
    ]);
    return {
      access_token: at,
      refresh_token: rt,
    };
  }
  async updateRtHash(id: string, token: string) {
    const hashedToken = await this.hashData(token)
    return await this.vendorModel.findByIdAndUpdate(id, {
      hashRT: hashedToken
    })
  }

  async updateVendorProfile(
    id: string,
    updateDto: UpdateVendorDto
  ): Promise<ApiResponse<VendorResponse>> {
    try {
      const updatedVendor: Vendor = await this.vendorModel.findByIdAndUpdate(id, updateDto);

      return {
        success: true,
        message: 'Vendor profile updated successfully',
        data: this.formatVendorResponse(updatedVendor.toObject())
      };
    } catch (error) {
      throw new BadRequestException('Failed to update vendor profile');
    }
  }

  async verifyVendor(id: string): Promise<ApiResponse<VendorResponse>> {
    try {
      const vendor: Vendor = await this.vendorModel.findByIdAndUpdate(id, { isVerified: true });

      return {
        success: true,
        message: 'Vendor verified successfully',
        data: this.formatVendorResponse(vendor.toObject())
      };
    } catch (error) {
      throw new BadRequestException('Failed to verify vendor');
    }
  }

  async getVendorStats(id: string): Promise<ApiResponse<any>> {
    try {
      const vendor = await this.vendorModel
        .findById(id)
        .populate('products')
        .exec();

      if (!vendor) {
        throw new NotFoundException('Vendor not found');
      }

      const stats = {
        totalProducts: vendor.products.length,
        averageRating: vendor.rating,
        isVerified: vendor.isVerified,
        // Add more stats as needed
      };

      return {
        success: true,
        data: stats
      };
    } catch (error) {
      throw new BadRequestException('Failed to fetch vendor stats');
    }
  }



}
