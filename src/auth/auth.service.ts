import { ApiResponse, CreateUserDto } from '@/types';
import { User } from '../users/User.Schema';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { authDto, signinDto } from './dto';
import { token } from './types';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>
    , private jwtService: JwtService) { }
  async signUp(dto: authDto): Promise<token & { user: any }> {
    const userData: CreateUserDto = {
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      password: dto.password, // pre-save hash this ,
      role: dto.role
    }
    const newUser = await this.userModel.create(userData);

    const { access_token, refresh_token } = await this.getTokens(newUser.id, newUser.email);
    await this.updateRtHash(newUser.id, refresh_token);
    return { access_token, refresh_token, user: newUser };
  }
  async signIn(dto: signinDto): Promise<token & ApiResponse<User>> {
    const user = await this.userModel.findOne({
      email: dto.email,
    }, { password: 1, email: 1 });
    if (!user) throw new ForbiddenException('Access Denied');
    const isPassMatch = bcrypt.compareSync(dto.password, user.password)

    if (!isPassMatch) throw new ForbiddenException('Access Denied');
    const { access_token, refresh_token } = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, refresh_token);
    const userResult = await this.userModel.findOne({
      email: dto.email,
    }, { password: 0, hashedRT: 0 });
    return {
      access_token, refresh_token,
      data: userResult,
      success: true, message: "sign in success"
    }
  }
  async logOut(id: string) {
    await this.userModel.findByIdAndUpdate(id, { hashedRT: null, });
  }
  async refresh(id: string, refreshToken: string) {
    const user = await this.userModel.findById(id);
    const isRtMatch = bcrypt.compareSync(refreshToken, this.hashData(user.hashedRT));
    if (!isRtMatch) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async getTokens(id: string, email: string): Promise<token> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: id,
          email,
        },
        {
          expiresIn: 15 * 60,
          secret: process.env.JWT_SECRET_AT,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: id,
          email,
        },
        {
          expiresIn: '7d',
          secret: process.env.JWT_SECRET_RT,
        },
      ),
    ]);
    return {
      access_token: at,
      refresh_token: rt,
    };
  }
  async updateRtHash(id: string, token: string) {
    return await this.userModel.findByIdAndUpdate(id, {
      hashedRT: this.hashData(token)
    })
  }
  hashData(data: string) {
    return bcrypt.hashSync(data, 14);
  }
}
