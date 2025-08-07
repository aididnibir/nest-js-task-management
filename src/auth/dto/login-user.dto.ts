import { IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Username or email is required' })
  @Length(3, 100, {
    message: 'Username or email must be between 3 and 100 characters',
  })
  credential: string;

  @IsString()
  @Length(8, 1000, { message: 'Password must be at least 8 characters long' })
  password: string;
}
