import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/createUser.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiOkResponse,
} from '@nestjs/swagger';
import { UpdateUserDto } from './dto/updateUser.dto';
import { Paginate } from 'nestjs-paginate';
import type { PaginateQuery } from 'nestjs-paginate';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiCreatedResponse({ description: 'User created successfully' })
  @ApiBody({ type: CreateUserDto })
  async create(@Body() createDto: CreateUserDto) {
    return await this.usersService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users with pagination' })
  @ApiOkResponse({ description: 'Returns paginated users' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    example: 'name:ASC',
  })
  @ApiQuery({ name: 'search', required: false, type: String, example: 'john' })
  async findAll(@Paginate() query: PaginateQuery) {
    return await this.usersService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiParam({ name: 'id', type: 'number' })
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOneById(+id);
  }

  @Patch()
  @ApiOperation({ summary: 'Update a user' })
  @ApiCreatedResponse({ description: 'User updated successfully' })
  @ApiBody({ type: UpdateUserDto })
  async update(@Body() updateDto: UpdateUserDto) {
    const existUser = await this.usersService.findOneById(updateDto.id);

    if (!existUser) {
      throw new NotFoundException('User not found');
    }

    if (existUser.email !== updateDto.email) {
      const existEmail = await this.usersService.findOneByEmail(
        existUser.email,
      );

      if (existEmail) {
        throw new ConflictException('Email already exists');
      }
    }

    return await this.usersService.update(updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', type: 'number' })
  async remove(@Param('id') id: string) {
    return await this.usersService.remove(+id);
  }
}
