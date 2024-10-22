import { CreateUserDto, UserRole } from '@/types';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class authDto implements CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsEnum(UserRole, { message: 'Role must be one of: admin, user' })
  role: 'user' | 'admin';

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class signinDto {
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
