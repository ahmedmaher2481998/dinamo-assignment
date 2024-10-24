
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt'
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsString,
  MaxLength,
  MinLength
} from 'class-validator';
import { HydratedDocument } from 'mongoose';
export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @IsEmail()
  firstName: string;

  @Prop({ required: true })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;


  @Prop({ required: true, unique: true })
  @IsEmail()
  email: string;

  @Prop({ required: true })
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password: string;



  @Prop({ default: false })
  @IsBoolean()
  isVerified: boolean;

  @Prop({ enum: ['user', 'admin'], default: 'user' })
  @IsEnum(['user', 'admin', 'vendor'])
  role: string;

  @Prop({
    name: "refresh_token",
    type: String
  })
  hashedRT

  @Prop({ default: Date.now })
  @IsDate()
  lastLogin: Date;

}



export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.pre('save', async function (next) {
  try {
    if (this.password && this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 14);
    }
    next();
  } catch (err) {
    next(err);
  }
});

UserSchema.index({ email: 1 });
