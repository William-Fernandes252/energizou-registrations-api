import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Util method to create a new user. Built to be used both in controllers and in REPL
   * @param createUserDto
   * @returns User if payload is valid, else `null`
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const errors = await validate(createUserDto);
    if (errors.length > 0) {
      errors.forEach(console.error);
      return null;
    }
    const user = plainToClass(User, createUserDto);
    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: User['id']): Promise<User | null> {
    return await this.userRepository.findOneBy({ id });
  }

  async findOneByEmail(email: User['email']): Promise<User | null> {
    return await this.userRepository.findOneBy({ email });
  }

  async update(
    id: User['id'],
    updateUserDto: UpdateUserDto,
  ): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      return null;
    }
    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async remove(id: User['id']): Promise<User | null> {
    const removedUser = await this.userRepository.findOneBy({ id });
    if (!removedUser) {
      return null;
    }
    return await this.userRepository.softRemove(removedUser);
  }
}
