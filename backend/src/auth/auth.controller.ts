import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import RegisterDto from './dto/register.dto';
import LoginDto from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const { accessToken, refreshToken } =
        await this.authService.register(registerDto);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
      });

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        sameSite: 'strict',
      });

      return { message: 'Register successful' };
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ message: 'Registration failed' });
    }
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const { accessToken, refreshToken } =
        await this.authService.login(loginDto);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
      });

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        sameSite: 'strict',
      });
      return { message: 'Login successful' };
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ message: 'Login failed' });
    }
  }

  @Post('refresh-token')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const refreshToken = req.cookies['refreshToken'];

      if (!refreshToken) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .send({ message: 'No refresh token provided' });
        return;
      }

      const { accessToken, newRefreshToken } =
        await this.authService.refreshAccessToken(refreshToken);

      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        sameSite: 'strict',
      });

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        sameSite: 'strict',
      });
      return { message: 'Token refreshed successfully' };
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ message: 'Token refresh failed' });
    }
  }
}
