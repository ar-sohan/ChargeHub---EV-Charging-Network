import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}
  canActivate(context: ExecutionContext): boolean { const request = context.switchToHttp().getRequest(); const value = request.headers.authorization; if (!value?.startsWith('Bearer ')) throw new UnauthorizedException('Bearer token is required'); try { request.user = this.jwt.verify(value.slice(7)); return true; } catch { throw new UnauthorizedException('Token is invalid or expired'); } }
}
