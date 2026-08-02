import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

interface AuthRequest extends Request {
  user?: {
    sub: number;
    email: string;
  };
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<AuthRequest>();

    const auth = req.headers.authorization;

    if (!auth || !auth.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const token = auth.split(' ')[1];

      req.user = this.jwt.verify<{
        sub: number;
        email: string;
      }>(token);

      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
