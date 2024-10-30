import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiOkResponse,
} from '@nestjs/swagger';
import { CredentialsDto } from './dto/credentials.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResponseAuthModel } from './models/responseAuth';
import { JwtAuthGuard } from './guards/auth/auth.guard';
import { RequestResetPasswordDto } from './dto/request-password.dto';
@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiBody({
    type: CredentialsDto,
    description: 'Correo electrónico y contraseña del usuario',
  })
  @ApiOkResponse({
    description: 'Inicio de sesión exitoso',
    type: ResponseAuthModel,
  })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  login(@Body() credentials: CredentialsDto) {
    return this.authService.login(credentials);
  }

  @Post('forget-password')
  @ApiOperation({ summary: 'Olvidar contraseña' })
  @ApiBody({
    type: RequestResetPasswordDto,
    description: 'Correo electrónico del usuario',
  })
  @ApiResponse({
    status: 200,
    description:
      'Solicitud de restablecimiento de contraseña enviada correctamente',
  })
  forgetPassword(@Body('email') email: string) {
    return this.authService.forgetPassword(email);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Restablecer contraseña' })
  @ApiBody({
    type: ResetPasswordDto,
    description: 'Token y nueva contraseña del usuario',
  })
  @ApiOkResponse({ description: 'Contraseña restablecida correctamente' })
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  @ApiOperation({ summary: 'Cambiar contraseña' })
  @ApiBody({
    type: ChangePasswordDto,
    description: 'Id, contraseña actual y nueva contraseña del usuario',
  })
  @ApiOkResponse({ description: 'Contraseña cambiada correctamente' })
  changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    return this.authService.changePassword(changePasswordDto);
  }
}
