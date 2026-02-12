
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'; 
import { UserService } from './user.service';

@Controller('user')
@UseGuards(AuthGuard('jwt')) 
export class UserController {
  constructor(
    private userService: UserService
  ) {}
    
  @Get()
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get('/:id')
  async getUserById(@Param('id') id: number) {
    return this.userService.getUserById(id);
  }

  @Post()
  async createUser(@Body() user) {
    return this.userService.createUser(user);
  }
  
  @Put('/:id')
  async updateUser(@Param('id') id: number, @Body() user: any) {
    return this.userService.updateUser(id, user);
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: number) {
    return this.userService.deleteUser(id)
  }
}