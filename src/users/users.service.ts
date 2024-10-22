import { BaseCrudService } from '@/shared/BaseCrud.abstract';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { UserDocument } from './User.Schema';
import { CreateUserDto } from '@/types';

@Injectable()
export class UsersService extends BaseCrudService<UserDocument> {
  registerNewUser(dto: CreateUserDto) {
    return this.create(dto)
  }
}
