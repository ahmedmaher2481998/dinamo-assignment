import { CreateUserDto, UserRole } from '@/types';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class authDto implements CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  lastName: string;

  @IsNotEmpty()
  @IsEnum(UserRole, { message: 'Role must be one of: admin, user' })
  @ApiProperty()
  role: UserRole;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password: string;
}

export class signinDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password: string;
}
