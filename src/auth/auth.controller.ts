import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { getCurrentUser, getCurrentUserId, isPublic } from './decorators';
import { authDto, signinDto } from './dto';
import { RtGuard } from './guards';
import { token } from './types';
import { ApiResponse, CreateUserDto, UserResponse } from '@/types';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }


  // local(signUp)
  @isPublic()
  @Post('/sign-up')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() dto: authDto): Promise<token & ApiResponse<any>> {
    const { access_token, refresh_token, user } = await this.authService.signUp(dto);
    return {
      access_token, data: user,
      refresh_token,
      success: true,
      message: 'user created successfully'
    }
  }

  @isPublic()
  // local(signIn)
  @Post('/sign-in')
  @HttpCode(HttpStatus.ACCEPTED)
  signIn(@Body() dto: signinDto): Promise<token> {
    return this.authService.signIn(dto);
  }
  // local/logout
  @Post('/log-out')
  @HttpCode(HttpStatus.OK)
  logout(@getCurrentUserId() id: string) {
    this.authService.logOut(id);
  }
  // local(refresh)
  @isPublic()
  @UseGuards(RtGuard)
  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  refresh(
    @getCurrentUserId() id: string,
    @getCurrentUser('refreshToken') refreshToken: string,
  ): Promise<token> {
    return this.authService.refresh(id, refreshToken);
  }
}
