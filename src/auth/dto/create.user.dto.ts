import {
  Length,
  IsEmail,
  IsString,
  IsNotEmpty,
  IsPhoneNumber,
  Matches,
} from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';

export class CreateUserDto {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @IsEmail({}, { message: 'Email must be valid' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @Length(3, 50, { message: 'Username must be between 3 and 50 characters' })
  userName: string;

  @IsString()
  @Length(1, 50, { message: 'First name must be between 1 and 50 characters' })
  firstName: string;

  @IsString()
  @Length(1, 50, { message: 'Last name must be between 1 and 50 characters' })
  lastName: string;

  @IsString()
  @Length(8, 1000, { message: 'Password must be at least 8 characters long' })
  @Matches(/(?=.*[a-z])/, {
    message: 'Password must contain at least one lowercase letter',
  })
  @Matches(/(?=.*[A-Z])/, {
    message: 'Password must contain at least one uppercase letter',
  })
  @Matches(/(?=.*\d)/, {
    message: 'Password must contain at least one number',
  })
  @Matches(/(?=.*\W)/, {
    message: 'Password must contain at least one special character',
  })
  password: string;

  @IsPhoneNumber(undefined, { message: 'Phone number must be valid' })
  phoneNumber: string;
}
