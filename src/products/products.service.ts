import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './Product.Schema';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductResponse,
  ApiResponse,
  PaginatedResponse,
  ProductQuery
} from '@/types';



@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>
  ) { }

  async create(createDto: CreateProductDto): Promise<ApiResponse<ProductResponse>> {
    try {
      const product = new this.productModel({
        ...createDto,
        vendor: createDto.vendorId
      });

      const savedProduct = await product.save();

      return {
        success: true,
        data: await this.populateProduct(savedProduct),
        message: 'Product created successfully'
      };
    } catch (error) {
      if (error.code === 11000) { // Duplicate key error
        throw new BadRequestException('Product with this name already exists');
      }
      throw error;
    }
  }
  getFilter(query: ProductQuery) {
    const {

      search,
      category,
      minPrice,
      maxPrice,
      vendorId,
      inStock
    } = query;

    const filter: any = {};

    // filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      filter.categories = category;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = minPrice;
      if (maxPrice !== undefined) filter.price.$lte = maxPrice;
    }

    if (vendorId) {
      filter.vendor = vendorId;
    }

    if (inStock !== undefined) {
      filter.stock = inStock ? { $gt: 0 } : 0;
    }
    return filter
  }
  async findAll(query: ProductQuery): Promise<ApiResponse<PaginatedResponse<ProductResponse>>> {
    const {
      page = 1,
      limit = 10
    } = query;
    const filter = this.getFilter(query)
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      this.productModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .populate('vendor', '-password'),
      this.productModel.countDocuments(filter)
    ]);

    const populatedProducts = await Promise.all(
      products.map(product => this.populateProduct(product))
    );

    return {
      success: true,
      data: {
        items: populatedProducts,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      message: 'Products retrieved successfully'
    };
  }

  async findById(id: string): Promise<ApiResponse<ProductResponse>> {
    const product = await this.productModel
      .findById(id)
      .populate('vendor', '-password');

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return {
      success: true,
      data: await this.populateProduct(product),
      message: 'Product retrieved successfully'
    };
  }

  async update(
    id: string,
    updateDto: UpdateProductDto
  ): Promise<ApiResponse<ProductResponse>> {
    const product = await this.productModel
      .findByIdAndUpdate(
        id,
        { $set: updateDto },
        { new: true }
      )
      .populate('vendor', '-password');

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return {
      success: true,
      data: await this.populateProduct(product),
      message: 'Product updated successfully'
    };
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    const product = await this.productModel.findByIdAndDelete(id);

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return {
      success: true,
      data: null,
      message: 'Product deleted successfully'
    };
  }

  async updateStock(
    id: string,
    quantity: number
  ): Promise<ApiResponse<ProductResponse>> {
    const product = await this.productModel
      .findByIdAndUpdate(
        id,
        { $inc: { stock: quantity } },
        { new: true }
      )
      .populate('vendor', '-password');

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    if (product.stock < 0) {
      // Rollback the stock update
      await product.updateOne({ $inc: { stock: -quantity } });
      throw new BadRequestException('Insufficient stock');
    }

    return {
      success: true,
      data: await this.populateProduct(product),
      message: 'Product stock updated successfully'
    };
  }

  private async populateProduct(product: Product): Promise<ProductResponse> {
    const populated = await product.populate('vendor', '-password');
    return populated.toObject();
  }
}
