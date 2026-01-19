import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/createUser.dto';
import { ApiBody, ApiCreatedResponse } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiCreatedResponse({
    description: 'User created successfully',
  })
  @ApiBody({
    type: CreateUserDto,
  })
  @Post()
  async create(@Body() createDto: CreateUserDto) {
    return await this.usersService.create(createDto);
  }
}
