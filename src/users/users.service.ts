import { ApiResponse } from '@/types';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './User.Schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>
  ) { }



  async getUserProfile(id: string): Promise<ApiResponse<User>> {
    const user = await this.userModel.findById(id, { password: 0, hashedRT: 0 })

    return {
      data: user,
      success: true,
      message: ''
    }
  }
}
