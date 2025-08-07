import { Repository } from 'typeorm';
import { Users } from './user.entity';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {
    super({
      secretOrKey: 'topSecret93',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload): Promise<Users> {
    const { userName, email } = payload;
    const user = await this.usersRepository.findOne({
      where: [{ userName: userName }, { email: email }],
    });

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
