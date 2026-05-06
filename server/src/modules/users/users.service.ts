import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { paginate, PaginateQuery, FilterOperator } from 'nestjs-paginate';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async findOneByEmail(email: string) {
    try {
      const user = await this.usersRepository.findOneBy({ email });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      throw new BadRequestException('Error to find user');
    }
  }

  async findOneById(id: number) {
    try {
      const user = await this.usersRepository.findOneBy({ id });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      throw new BadRequestException('Error to find user');
    }
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const { name, email, password, role } = createUserDto;

      const existUser = await this.findOneByEmail(email);

      if (existUser) {
        throw new ConflictException('User already exists');
      }

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = this.usersRepository.create({
        name,
        email,
        password: hashedPassword,
        role,
      });

      return this.usersRepository.save(user);
    } catch (error) {
      throw new BadRequestException('Error to create user');
    }
  }

  async findAll(query: PaginateQuery): Promise<UserEntity[]> {
    try {
      const result = await paginate<UserEntity>(query, this.usersRepository, {
        sortableColumns: ['id', 'name', 'email', 'role'],
        filterableColumns: {
          id: [FilterOperator.EQ, FilterOperator.ILIKE],
          name: [FilterOperator.EQ, FilterOperator.ILIKE],
          email: [FilterOperator.EQ, FilterOperator.ILIKE],
          role: [FilterOperator.EQ, FilterOperator.ILIKE],
        },
        searchableColumns: ['name', 'email'],
        defaultSortBy: [['name', 'ASC']],
        defaultLimit: 10,
        maxLimit: 25,
      });

      return result.data;
    } catch (error) {
      throw new BadRequestException('Error to list users');
    }
  }

  async remove(id: number) {
    try {
      const user = await this.findOneById(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return this.usersRepository.remove(user);
    } catch (error) {
      throw new BadRequestException('Error to remove user');
    }
  }

  async update(updateUserDto: UpdateUserDto) {
    try {
      const { id, ...updateData } = updateUserDto;
      if (updateData.password) {
        const salt = await bcrypt.genSalt();
        updateData.password = await bcrypt.hash(updateData.password, salt);
      }
      return this.usersRepository.update(id, updateData);
    } catch (error) {
      throw new BadRequestException('Error to update user');
    }
  }
}
