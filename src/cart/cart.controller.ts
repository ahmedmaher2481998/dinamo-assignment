import { ApiResponse, CartResponse, CreateCartItemDto, UpdateCartItemDto } from "@/types";
import { Body, Controller, Delete, Get, Param, Post, Put, Req } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CartService } from "./cart.service";
@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) { }

  @Get()
  getCart(@Req() req: Request): Promise<ApiResponse<CartResponse>> {
    const userId = req['user'].id;
    return this.cartService.getUserCart(userId);
  }

  @Post('items')
  addItem(
    @Req() req: Request,
    @Body() createDto: CreateCartItemDto
  ): Promise<ApiResponse<CartResponse>> {
    const userId = req['user'].id;
    return this.cartService.addItem(userId, createDto);
  }

  @Put('items/:productId')
  updateItem(
    @Req() req: Request,
    @Param('productId') productId: string,
    @Body() updateDto: UpdateCartItemDto
  ): Promise<ApiResponse<CartResponse>> {
    const userId = req['user'].id;
    return this.cartService.updateItemQuantity(userId, productId, updateDto);
  }

  @Delete('items/:productId')
  removeItem(
    @Req() req: Request,
    @Param('productId') productId: string
  ): Promise<ApiResponse<CartResponse>> {
    const userId = req['user'].id;
    return this.cartService.removeItem(userId, productId);
  }

  @Delete()
  clearCart(@Req() req: Request): Promise<ApiResponse<null>> {
    const userId = req['user'].id;
    return this.cartService.clearCart(userId);
  }

  @Get('validate')
  validateCart(@Req() req: Request): Promise<ApiResponse<boolean>> {
    const userId = req['user'].id;
    return this.cartService.validateCart(userId);
  }
}