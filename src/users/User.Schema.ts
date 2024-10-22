
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
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
  @IsEnum(['user', 'admin'])
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
UserSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    // Add password hashing logic here
  }
  next();
});

UserSchema.index({ email: 1 });
