import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AtJTW, RtJTW } from './strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@/users/User.Schema';
@Module({
  imports: [JwtModule.register({}), MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [AuthController],
  providers: [AuthService, AtJTW, RtJTW],
})
export class AuthModule { }
