import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import config from 'src/core/config';
import { PayloadModel } from '../models/payloadModel';
import { Request } from 'express';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class JWTstrategy extends PassportStrategy(Strategy) {
  private logger = new Logger('JWTstrategy');
  constructor(private _userService: UserService) {
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
    const user = await this._userService.validateUser(payload);
    if (!user) {
      this.logger.error('User not found');
      throw new HttpException('🚫 NO AUTORIZADO. 🚫', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}
