import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';



@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id') 
  async getUser(@Param('id') id: string): Promise<User> {
    const user = await this.userService.findUserById(id);
    return user;
  }
}
