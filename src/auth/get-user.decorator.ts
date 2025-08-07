import { Users } from './user.entity';
import { Request } from 'express';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const getUser = createParamDecorator(
  (_data, ctx: ExecutionContext): Users => {
    const req = ctx.switchToHttp().getRequest<Request>();
    return req.user as Users;
  },
);
