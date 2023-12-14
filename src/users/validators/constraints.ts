import {
  ValidatorConstraint,
  type ValidatorConstraintInterface,
} from 'class-validator';
import { CreateUserDto } from '../dto/create-user.dto';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users.service';
import { User } from '../entities/user.entity';

@Injectable()
@ValidatorConstraint({
  name: 'UserWithEmailAlreadyExistsConstraint',
  async: true,
})
export class UserWithEmailAlreadyExistsConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly usersService: UsersService) {}

  async validate(value: CreateUserDto['email']) {
    return (await this.usersService.findOneByEmail(value)) === null;
  }

  defaultMessage() {
    return `Já existe um usuário cadastrado com este email.`;
  }
}

@Injectable()
@ValidatorConstraint({
  name: 'UserExistsConstraint',
  async: true,
})
export class UserExistsConstraint implements ValidatorConstraintInterface {
  constructor(private readonly usersService: UsersService) {}

  async validate(id: User['id']) {
    return (await this.usersService.findOne(id)) !== null;
  }

  defaultMessage() {
    return `O usuário informado não existe.`;
  }
}
