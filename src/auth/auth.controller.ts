import { Users } from './user.entity';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from './dto/create.user.dto';
import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get()
  async getAllUser(): Promise<Users[]> {
    return await this.authService.getAllUsers();
  }

  @Post('/signin')
  async createNewUser(
    @Body() createNewUserDto: CreateUserDto,
  ): Promise<object> {
    return await this.authService.createNewUser(createNewUserDto);
  }

  @Post('/logIn')
  async userLogin(@Body() loginUserDto: LoginUserDto): Promise<object> {
    return await this.authService.userLogin(loginUserDto);
  }
}
