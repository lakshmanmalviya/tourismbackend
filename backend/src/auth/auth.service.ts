import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';
import RegisterDto from './dto/register.dto';
import LoginDto from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { username, email, password } = registerDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userService.createUser({
      username,
      email,
      password: hashedPassword,
    });

    const accessTokenPayload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };

    const refreshTokenPayload = { id: user.id };

    const accessToken = this.jwtService.sign(accessTokenPayload, {
      expiresIn: '10m',
    });

    const refreshToken = this.jwtService.sign(refreshTokenPayload, {
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userService.findByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessTokenPayload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };
    
    const refreshTokenPayload = { id: user.id };

    const accessToken = this.jwtService.sign(accessTokenPayload, {
      expiresIn: '10m',
    });

    const refreshToken = this.jwtService.sign(refreshTokenPayload, {
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET,
      });
      const newPayload = { username: payload.username, sub: payload.sub };
      const accessToken = this.jwtService.sign(newPayload, {
        expiresIn: '10m',
      });
      const newRefreshToken = this.jwtService.sign(newPayload, {
        expiresIn: '7d',
      });

      return { accessToken, newRefreshToken };
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
