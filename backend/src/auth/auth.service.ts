import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';
import RegisterDto from './dto/register.dto';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { fullName, email, password } = registerDto;

    
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userService.createUser({
      fullName,
      email,
      password: hashedPassword,
    });

    const accessTokenPayload = {
      username: user.email,
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

    return { accessToken, refreshToken };
  }
}
