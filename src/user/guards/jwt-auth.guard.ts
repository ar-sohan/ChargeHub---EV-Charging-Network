import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user.entity';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    @InjectRepository(UserEntity) private readonly users: Repository<UserEntity>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<{
      headers: { authorization?: string };
      user?: { sub: number; email: string; role: string };
    }>();
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) throw new UnauthorizedException('No token provided');
    let payload: { sub: number; email: string; role: string };
    try {
      payload = this.jwt.verify(auth.slice(7));
      if (!Number.isSafeInteger(payload.sub) || payload.sub < 1 || payload.role !== 'user') {
        throw new Error('Invalid user token');
      }
    } catch { throw new UnauthorizedException('Please log in again'); }
    const user = await this.users.findOne({ where: { id: payload.sub } });
    if (!user || user.status !== 'active') throw new UnauthorizedException('Account is unavailable');
    req.user = payload;
    return true;
  }
}
