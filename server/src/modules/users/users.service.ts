import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { paginate, PaginateQuery, Paginated } from 'nestjs-paginate';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findOneByEmail(email: string) {
    return this.usersRepository.findOneBy({ email });
  }

  async findOneById(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async create(createUserDto: CreateUserDto) {
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
  }

  async findAll(query: PaginateQuery): Promise<Paginated<User>> {
    return paginate(query, this.usersRepository, {
      sortableColumns: ['id', 'name', 'email', 'role'],
      searchableColumns: ['name', 'email'],
      defaultSortBy: [['id', 'ASC']],
      defaultLimit: 10,
      maxLimit: 25,
    });
  }

  async remove(id: number) {
    const user = await this.findOneById(id);
    return this.usersRepository.remove(user);
  }

  async update(updateUserDto: UpdateUserDto) {
    const { id, ...updateData } = updateUserDto;

    if (updateData.password) {
      const salt = await bcrypt.genSalt();
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    return this.usersRepository.update(id, updateData);
  }
}
