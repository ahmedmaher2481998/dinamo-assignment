import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ProductService } from './products.service';
import { ApiResponse, CreateProductDto, PaginatedResponse, ProductQuery, ProductResponse, UpdateProductDto } from '@/types';
import { VendorGuard } from '@/auth/guards/Vendor.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  @UseGuards(VendorGuard)
  create(@Body() createDto: CreateProductDto): Promise<ApiResponse<ProductResponse>> {
    return this.productService.create(createDto);
  }

  @Get()
  findAll(@Query() query: ProductQuery): Promise<ApiResponse<PaginatedResponse<ProductResponse>>> {
    return this.productService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ApiResponse<ProductResponse>> {
    return this.productService.findById(id);
  }

  @Put(':id')
  @UseGuards(VendorGuard)
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateProductDto
  ): Promise<ApiResponse<ProductResponse>> {
    return this.productService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(VendorGuard)
  remove(@Param('id') id: string): Promise<ApiResponse<void>> {
    return this.productService.delete(id);
  }

  @Patch(':id/stock')
  @UseGuards(VendorGuard)
  updateStock(
    @Param('id') id: string,
    @Body('quantity') quantity: number
  ): Promise<ApiResponse<ProductResponse>> {
    return this.productService.updateStock(id, quantity);
  }
}

