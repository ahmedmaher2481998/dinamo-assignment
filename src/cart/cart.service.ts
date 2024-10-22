import { ProductService } from '@/products/products.service';
import { BaseCrudService } from '@/shared/BaseCrud.abstract';
import {
  ApiResponse,
  CartResponse,
  CreateCartItemDto,
  UpdateCartItemDto
} from '@/types';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart } from './Cart.Schema';

@Injectable()
export class CartService extends BaseCrudService<Cart> {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    private readonly productService: ProductService
  ) {
    super(cartModel);
  }

  async getUserCart(userId: string): Promise<ApiResponse<CartResponse>> {
    try {
      const cart: Cart = await this.cartModel
        .findOne({ user: userId })
        .populate({
          path: 'items.product',
          populate: {
            path: 'vendor',
            select: '-password'
          }
        })
        .exec();

      if (!cart) {
        return {
          success: true,
          data: null,
          message: 'Cart is empty'
        };
      }

      return {
        success: true,
        // @ts-ignore 
        data: cart as CartResponse,
        message: 'Cart retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to retrieve cart'
      };
    }
  }

  async addItem(userId: string, itemDto: CreateCartItemDto): Promise<ApiResponse<CartResponse>> {
    try {
      // Verify product exists and has enough stock
      const product = await this.productService.findById(itemDto.productId);
      if (product.data.stock < itemDto.quantity) {
        throw new BadRequestException('Not enough stock available');
      }

      // Find or create cart
      let cart = await this.cartModel.findOne({ user: userId });
      if (!cart) {
        cart = new this.cartModel({ user: userId, items: [] });
      }

      // Check if product already in cart
      const existingItemIndex = cart.items.findIndex(
        item => item.product.toString() === itemDto.productId
      );

      if (existingItemIndex > -1) {
        // Update quantity if product exists
        cart.items[existingItemIndex].quantity += itemDto.quantity;
      } else {
        // Add new item
        const newItem = {
          product: itemDto.productId,
          quantity: itemDto.quantity,
          price: product.data.price
        }
        // @ts-ignore
        cart.items.push(newItem);
      }

      // Save and populate cart
      await cart.save();
      const populatedCart: CartResponse = await cart.populate([
        {
          path: 'items.product',
          populate: {
            path: 'vendor',
            select: '-password'
          }
        }
      ]);

      return {
        success: true,
        data: populatedCart,
        message: 'Item added to cart successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.message || 'Failed to add item to cart'
      };
    }
  }

  async updateItemQuantity(
    userId: string,
    productId: string,
    updateDto: UpdateCartItemDto
  ): Promise<ApiResponse<CartResponse>> {
    try {
      const cart = await this.cartModel.findOne({ user: userId });
      if (!cart) {
        throw new NotFoundException('Cart not found');
      }

      const itemIndex = cart.items.findIndex(
        item => item.product.toString() === productId
      );

      if (itemIndex === -1) {
        throw new NotFoundException('Item not found in cart');
      }

      // Verify stock availability
      const product = await this.productService.findById(productId);
      if (product.data.stock < updateDto.quantity) {
        throw new BadRequestException('Not enough stock available');
      }

      // Update quantity
      cart.items[itemIndex].quantity = updateDto.quantity;

      // Remove item if quantity is 0
      if (updateDto.quantity === 0) {
        cart.items.splice(itemIndex, 1);
      }

      await cart.save();
      const populatedCart: CartResponse = await cart.populate([
        {
          path: 'items.product',
          populate: {
            path: 'vendor',
            select: '-password'
          }
        }
      ]);

      return {
        success: true,
        data: populatedCart,
        message: 'Cart updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.message || 'Failed to update cart'
      };
    }
  }

  async removeItem(userId: string, productId: string): Promise<ApiResponse<CartResponse>> {
    try {
      const cart = await this.cartModel.findOne({ user: userId });
      if (!cart) {
        throw new NotFoundException('Cart not found');
      }

      cart.items = cart.items.filter(
        item => item.product.toString() !== productId
      );

      await cart.save();
      const populatedCart: CartResponse = await cart.populate([
        {
          path: 'items.product',
          populate: {
            path: 'vendor',
            select: '-password'
          }
        }
      ]);

      return {
        success: true,
        data: populatedCart,
        message: 'Item removed from cart successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.message || 'Failed to remove item from cart'
      };
    }
  }

  async clearCart(userId: string): Promise<ApiResponse<null>> {
    try {
      await this.cartModel.findOneAndUpdate(
        { user: userId },
        { $set: { items: [] } }
      );

      return {
        success: true,
        data: null,
        message: 'Cart cleared successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to clear cart'
      };
    }
  }

  // Helper method to validate cart for checkout
  async validateCart(userId: string): Promise<ApiResponse<boolean>> {
    try {
      const cart = await this.cartModel
        .findOne({ user: userId })
        .populate('items.product');

      if (!cart || cart.items.length === 0) {
        return {
          success: false,
          data: false,
          message: 'Cart is empty'
        };
      }

      // Check stock availability for all items
      for (const item of cart.items) {
        const product = await this.productService.findById(item.product.toString());
        if (product.data.stock < item.quantity) {
          return {
            success: false,
            data: false,
            message: `Not enough stock for product: ${product.data.name}`
          };
        }
      }

      return {
        success: true,
        data: true,
        message: 'Cart is valid'
      };
    } catch (error) {
      return {
        success: false,
        data: false,
        message: 'Failed to validate cart'
      };
    }
  }
}

