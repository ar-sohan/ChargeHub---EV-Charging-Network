import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export type TechnicianTokenPayload = { sub: number; email: string; role: 'technician' };

@Injectable()
export class TechnicianAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const auth: string | undefined = req.headers['authorization'];
    if (!auth || !auth.startsWith('Bearer ')) throw new UnauthorizedException('No token provided');
    let payload: TechnicianTokenPayload;
    try {
      payload = this.jwt.verify(auth.slice(7));
    } catch {
      throw new UnauthorizedException('Please log in again');
    }
    if (payload?.role !== 'technician' || !Number.isSafeInteger(payload.sub)) {
      throw new UnauthorizedException('Technician access only');
    }
    req.user = payload;
    return true;
  }
}
