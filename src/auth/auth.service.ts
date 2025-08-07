import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Users } from './user.entity';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from './dto/create.user.dto';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    private jwtService: JwtService,
  ) {}

  async getAllUsers(): Promise<Users[]> {
    const allUsers = await this.usersRepository.find();
    if (allUsers?.length > 0) {
      return allUsers;
    } else {
      throw new NotFoundException('No users found');
    }
  }

  async createNewUser(createNewUserDto: CreateUserDto): Promise<object> {
    try {
      const { email, firstName, lastName, phoneNumber, password, userName } =
        createNewUserDto;

      const salt = await bcrypt.genSalt();
      const saltedPassword = await bcrypt.hash(password, salt);

      const newUserDetails = {
        email,
        firstName,
        lastName,
        userName,
        phoneNumber,
        password: saltedPassword,
      };

      const savedUser = this.usersRepository.create(newUserDetails);
      await this.usersRepository.save(savedUser);
      return {
        success: true,
        message: 'User Registration was successful',
      };
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === '23505') {
        const detail = 'detail' in error ? (error.detail as string) : '';
        console.log('details', detail);
        if (detail.includes('email')) {
          throw new ConflictException('Email is already registered');
        } else if (detail.includes('userName')) {
          throw new ConflictException('Username is already taken');
        } else if (detail.includes('phoneNumber')) {
          throw new ConflictException('Phone Number already exists!');
        } else {
          throw new ConflictException('Duplicate value error');
        }
      }
      // Re-throw other errors as InternalServerError
      throw error;
    }
  }

  async userLogin(loginUserDto: LoginUserDto): Promise<object> {
    const { credential, password } = loginUserDto;

    const isExistingUser = await this.usersRepository.findOne({
      where: [{ userName: credential }, { email: credential }],
    });

    if (!isExistingUser) {
      throw new NotFoundException('User not found');
    }

    const isUserPasswordValid = await bcrypt.compare(
      password,
      isExistingUser.password,
    );

    if (!isUserPasswordValid) {
      throw new UnauthorizedException('Invalid password, Please try again!');
    } else {
      const payload: JwtPayload = { userName: credential, email: credential };
      const accessToken = this.jwtService.sign(payload);
      return { accessToken };
    }
  }
}
