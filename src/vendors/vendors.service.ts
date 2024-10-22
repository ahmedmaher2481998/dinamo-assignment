import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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

@Injectable()
export class VendorService extends BaseCrudService<Vendor> {
  constructor(
    @InjectModel(Vendor.name) private vendorModel: Model<Vendor>
  ) {
    super(vendorModel);
  }

  private async hashPassword(password: string): Promise<string> {
    return hash(password, 10);
  }

  private formatVendorResponse(vendor: VendorType): VendorResponse {
    const { password, ...vendorResponse } = vendor;
    return vendorResponse;
  }

  async registerVendor(createDto: CreateVendorDto): Promise<ApiResponse<VendorResponse>> {
    try {
      // Check if vendor already exists
      const existingVendor = await this.vendorModel.findOne({
        businessEmail: createDto.businessEmail
      });

      if (existingVendor) {
        throw new ConflictException('Vendor with this email already exists');
      }

      // Hash password
      const hashedPassword = await this.hashPassword(createDto.password);

      // Create vendor
      const vendor = await super.create({
        ...createDto,
        password: hashedPassword,
        isVerified: false,
        rating: 0,
        products: []
      });

      return {
        success: true,
        message: 'Vendor registered successfully',
        data: this.formatVendorResponse(vendor.toObject())
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Failed to register vendor');
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
