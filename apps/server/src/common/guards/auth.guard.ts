import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Optional,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PrismaService } from '../services/prisma/prisma.service';

export interface JwtUserPayload {
  sub: string;
  email?: string;
  phone?: string;
  tokenType?: string;
  sessionId?: string;
  deviceId?: string;
  tokenVersion?: number;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtUserPayload;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Optional() private readonly prisma?: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Authentication token is required');
    }

    let payload: JwtUserPayload;
    try {
      payload = await this.jwtService.verifyAsync<JwtUserPayload>(token, {
        secret: this.configService.getOrThrow<string>('JWT_SECRET'),
      });
    } catch {
      throw new UnauthorizedException(
        'Invalid or expired authentication token',
      );
    }

    if (payload.tokenType && payload.tokenType !== 'access') {
      throw new UnauthorizedException('Invalid token type');
    }

    // Session tracking & token revocation verification
    if (this.prisma && payload.sessionId) {
      const session = await this.prisma.userSession.findUnique({
        where: { id: payload.sessionId },
        select: {
          id: true,
          isRevoked: true,
          expiresAt: true,
          lastActiveAt: true,
          user: {
            select: {
              tokenVersion: true,
              isDeleted: true,
            },
          },
        },
      });

      if (!session) {
        throw new UnauthorizedException('Session not found or has been removed');
      }

      if (session.isRevoked) {
        throw new UnauthorizedException('Session has been revoked');
      }

      if (session.expiresAt < new Date()) {
        throw new UnauthorizedException(
          'Session has expired. Please sign in again.',
        );
      }

      if (session.user?.isDeleted) {
        throw new UnauthorizedException('User account no longer exists');
      }

      if (
        payload.tokenVersion !== undefined &&
        session.user &&
        payload.tokenVersion !== session.user.tokenVersion
      ) {
        throw new UnauthorizedException(
          'Token has been invalidated. Please sign in again.',
        );
      }

      // Throttled background update of lastActiveAt (every 5 minutes)
      const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
      if (session.lastActiveAt.getTime() < fiveMinutesAgo) {
        this.prisma.userSession
          .update({
            where: { id: session.id },
            data: { lastActiveAt: new Date() },
          })
          .catch(() => {});
      }
    }

    request.user = payload;
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
