import {
  Injectable, CanActivate, ExecutionContext, UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwt: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const auth = req.headers['authorization'];
    if (!auth || !auth.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided');
    }
    let payload: { sub: number; email: string; role: string };
    try {
      payload = this.jwt.verify(auth.split(' ')[1]);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
    // All roles share one signing secret, so only admin tokens may pass here.
    if (payload?.role !== 'admin') {
      throw new UnauthorizedException('Admin access only');
    }
    req.user = payload;
    return true;
  }
}
