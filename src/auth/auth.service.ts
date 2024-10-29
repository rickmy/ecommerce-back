import {
  Injectable,
  UnauthorizedException,
  HttpException,
  HttpStatus,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { MailService } from 'src/modules/mail/mail.service';
import { PayloadModel } from './models/payloadModel';
import { UserService } from 'src/modules/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ResponseAuthModel } from './models/responseAuth';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CredentialsDto } from './dto/credentials.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as bcrypt from 'bcrypt';
import { RoleService } from 'src/modules/role/role.service';
@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);
  constructor(
    private _mailService: MailService,
    private _userService: UserService,
    private _jwtService: JwtService,
    private _roleService: RoleService,
  ) {}

  async login(credentials: CredentialsDto): Promise<ResponseAuthModel> {
    this.logger.log(`Login attempt for ${credentials.email}`);
    const user = await this._userService.findByEmail(credentials.email);
    if (!user) {
      this.logger.log(`User not found ${credentials.email}`);
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }
    if (!user.status) throw new UnauthorizedException('Usuario inactivo');
    const isMatch = await this.comparePassword(
      credentials.password,
      user.password,
    );
    if (!isMatch) {
      throw new BadRequestException('Credenciales invalidas');
    }
    const payload: PayloadModel = {
      id: user.id,
      email: user.email,
      role: user.roleId,
    };
    user.password = undefined;
    this.logger.log(`Login success for ${credentials.email}`);
    return { accessToken: await this.createToken(payload) };
  }

  async createToken(payload: PayloadModel): Promise<string> {
    try {
      const token = await this._jwtService.signAsync(payload);
      return token;
    } catch (error) {
      this.logger.error('Error al crear el token JWT', error.stack);
      throw new UnauthorizedException(`Error en el token JWT ${error}`);
    }
  }

  async verifyToken(token: string): Promise<PayloadModel> {
    try {
      const payload = await this._jwtService.verifyAsync(token);
      return payload;
    } catch (error) {
      //this.loggerService.error('Error en el token JWT', error.stack);
      throw new UnauthorizedException(`Error en el token JWT ${error}`);
    }
  }

  async forgetPassword(email: string): Promise<HttpException> {
    const userExist = await this._userService.findByEmail(email);
    if (!userExist)
      throw new HttpException('Usuario no existe', HttpStatus.BAD_REQUEST);
    if (!userExist.status)
      throw new HttpException(
        'El usuario se encuentra inactivo/bloqueado',
        HttpStatus.CONFLICT,
      );
    const token = await this._jwtService.signAsync(
      {
        id: userExist.id,
        email: userExist.email,
      },
      { expiresIn: '5m' },
    );
    const fullName = `${userExist.email}`;
    const send = await this._mailService.sendForgetPasswordEmail(
      email,
      token,
      fullName,
    );
    if (!send)
      throw new HttpException(
        'Error al enviar el correo',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    return new HttpException('Correo enviado exitosamente', HttpStatus.OK);
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<HttpException> {
    try {
      const payload = await this.verifyToken(resetPasswordDto.token);
      if (!payload)
        throw new HttpException(
          'El token no es valido',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      const userExist = await this._userService.findByEmail(payload.email);
      if (!userExist)
        throw new HttpException('Usuario no existe', HttpStatus.BAD_REQUEST);
      if (!userExist.status)
        throw new HttpException(
          'El usuario se encuentra inactivo/bloqueado',
          HttpStatus.CONFLICT,
        );
      const ok = await this._userService.updatePassword(
        userExist.id,
        resetPasswordDto.newPassword,
      );
      if (!ok)
        throw new HttpException(
          'Error al actualizar la contraseña',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      return new HttpException('Contraseña actualizada', HttpStatus.OK);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async changePassword(
    changePasswordDto: ChangePasswordDto,
  ): Promise<HttpException> {
    const userExist = await this._userService.findByEmail(
      changePasswordDto.email,
    );
    if (!userExist)
      throw new HttpException('Usuario no existe', HttpStatus.BAD_REQUEST);
    if (!userExist.status)
      throw new HttpException(
        'El usuario se encuentra inactivo/bloqueado',
        HttpStatus.CONFLICT,
      );
    const isMatch = await this.comparePassword(
      changePasswordDto.currentPassword,
      userExist.password,
    );
    if (!isMatch)
      throw new HttpException(
        'La contraseña actual no coincide',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    const changed = await this._userService.updatePassword(
      userExist.id,
      changePasswordDto.newPassword,
    );
    if (!changed)
      throw new HttpException(
        'Error al actualizar la contraseña',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    return new HttpException('Contraseña actualizada', HttpStatus.OK);
  }

  async validateToken(payload: PayloadModel): Promise<boolean> {
    const hasUser = await this._userService.validateUser(payload);
    if (!hasUser) throw new UnauthorizedException('🚫 NO AUTORIZADO. 🚫');
    return true;
  }

  async comparePassword(
    password: string,
    storedPasswordHash: string,
  ): Promise<boolean> {
    return bcrypt.compareSync(password, storedPasswordHash);
  }
}
