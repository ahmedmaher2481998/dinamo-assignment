import { ForbiddenException, Injectable } from '@nestjs/common';
import { authDto } from './dto';
import * as bcrypt from 'bcrypt';
import { token } from './types';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@/users/users.service';
import { User, UserDocument } from '@/users/User.Schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>
    , private jwtService: JwtService) { }
  async signUp(dto: authDto): Promise<token> {
    // TODO replace with mongo 
    const newUser = await this.userModel.create({
      email: dto.email,
      hash: dto.password
    });

    const tokens = await this.getTokens(newUser.id, newUser.email);
    await this.updateRtHash(newUser.id, tokens.refresh_token);
    return tokens;
  }
  async signIn(dto: authDto): Promise<token> {
    // TODO replace with mongo 
    const user = await this.userModel.findOne({
      email: dto.email,
    });
    if (!user) throw new ForbiddenException('Access Denied');
    const isPassMatch = bcrypt.compareSync(dto.password, this.hashData(user.password));
    if (!isPassMatch) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens((await user).id, (await user).email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }
  async logOut(id: number) {
    // TODO replace with mongo 
    await this.userModel.findByIdAndUpdate(id, { hashedRT: null, });
  }
  async refresh(id: number, refreshToken: string) {
    // TODO replace with mongo 
    const user = await this.userModel.findById(id);
    const isRtMatch = bcrypt.compareSync(refreshToken, this.hashData(user.hashedRT));
    if (!isRtMatch) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async getTokens(id: number, email: string): Promise<token> {
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
          expiresIn: 60 * 60 * 24 * 7,
          secret: process.env.JWT_SECRET_RT,
        },
      ),
    ]);
    return {
      access_token: at,
      refresh_token: rt,
    };
  }
  async updateRtHash(id: number, token: string) {
    // TODO replace with mongo 
    await this.userModel.findByIdAndUpdate(id, {
      hashedRT: this.hashData(token)
    })
  }
  hashData(data: string) {
    return bcrypt.hashSync(data, 14);
  }
}
