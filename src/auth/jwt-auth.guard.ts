import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      if (info?.message === 'jwt expired') {
        throw new UnauthorizedException('Token expirado');
      }
      if (info?.message === 'jwt malformed') {
        throw new UnauthorizedException('Token malformado');
      }
      if (info?.message === 'jwt must be provided') {
        throw new UnauthorizedException('Token não fornecido');
      }
      throw new UnauthorizedException('Token inválido');
    }
    return user;
  }
} 