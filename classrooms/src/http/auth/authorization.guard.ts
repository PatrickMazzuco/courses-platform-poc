import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlExecutionContext } from '@nestjs/graphql';
import jwt from 'express-jwt';
import { expressJwtSecret } from 'jwks-rsa';
import { promisify } from 'node:util';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  private auth0Audience: string;
  private auth0Domain: string;

  constructor(private readonly configService: ConfigService) {
    this.auth0Audience = this.configService.get<string>('AUTH0_AUDIENCE') ?? '';
    this.auth0Domain = this.configService.get<string>('AUTH0_DOMAIN') ?? '';
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { request, response } =
      GqlExecutionContext.create(context).getContext();

    const checkJWT = promisify(
      jwt({
        secret: expressJwtSecret({
          cache: true,
          rateLimit: true,
          jwksRequestsPerMinute: 5,
          jwksUri: `${this.auth0Domain}.well-known/jwks.json`,
        }),
        audience: this.auth0Audience,
        issuer: this.auth0Domain,
        algorithms: ['RS256'],
      }),
    );

    try {
      await checkJWT(request, response);

      return true;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
