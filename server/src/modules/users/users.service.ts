import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findOneByEmail(email: string) {
    return this.usersRepository.findOneBy({ email });
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const { name, email, password } = createUserDto;

      const existUser = await this.usersRepository.findOneBy({ email });

      if (existUser) {
        throw new ConflictException('User already exists');
      }

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = this.usersRepository.create({
        name,
        email,
        password: hashedPassword,
      });

      return this.usersRepository.save(user);
    } catch (error) {
      if (error instanceof Error) {
        throw new ConflictException(error.message);
      }
    }
  }
}
