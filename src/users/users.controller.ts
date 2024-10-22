import { getCurrentUserId } from '@/auth/decorators';
import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) { }

  @Get('profile')
  @HttpCode(HttpStatus.OK)
  getUser(@getCurrentUserId() id: string) {
    return this.userService.getUserProfile(id)
  }
}
