import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { CheckPolicies } from 'src/casl/check-policies.decorator';
import { Action } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(PoliciesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @CheckPolicies(ability => ability.can(Action.List, User))
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @CheckPolicies(ability => ability.can(Action.Retrieve, User))
  findOne(@Param('id') id: User['id']): Promise<User> {
    const user = this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  @Patch(':id')
  @CheckPolicies(ability => ability.can(Action.Update, User))
  async update(
    @Param('id') id: User['id'],
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const updatedUser = this.usersService.update(id, updateUserDto);
    if (!updatedUser) {
      throw new NotFoundException();
    }
    return updatedUser;
  }

  @Delete(':id')
  @CheckPolicies(ability => ability.can(Action.Delete, User))
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: User['id']): Promise<void> {
    const removedUser = await this.usersService.remove(id);
    if (!removedUser) {
      throw new NotFoundException();
    }
  }
}
