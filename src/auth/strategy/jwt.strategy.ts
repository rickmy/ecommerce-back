import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from '../auth.service';
import config from 'src/core/config';
import { PayloadModel } from '../models/payloadModel';
import { Request } from 'express';

@Injectable()
export class JWTstrategy extends PassportStrategy(Strategy) {
  private logger = new Logger('JWTstrategy');
  constructor(private _authService: AuthService) {
    super({
      secretOrKey: config().jwtSecret,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies?.Authentication;
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
    });
  }
  async validate(payload: PayloadModel) {
    return await this._authService.validateToken(payload);
  }
}
