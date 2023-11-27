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
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { CheckPolicies } from 'src/casl/check-policies.decorator';
import { Action } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { AllowAny } from 'src/auth/allow-any.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { DEFAULT_SECURITY_SCHEME } from 'src/config/auth.config';

@ApiTags('users')
@ApiBearerAuth(DEFAULT_SECURITY_SCHEME.apiName)
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(PoliciesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @AllowAny()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.create(createUserDto);
  }

  /**
   * Retorna uma lista com todos os usuários registrados.
   */
  @Get()
  @AllowAny()
  @CheckPolicies(ability => ability.can(Action.List, User))
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  /**
   * Busca um usuário pelo seu ID.
   */
  @ApiParam({ name: 'id', type: String, description: 'ID do usuário' })
  @Get(':id')
  @CheckPolicies(ability => ability.can(Action.Retrieve, User))
  async findOne(@Param('id') id: User['id']): Promise<User> {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  /**
   * Atualiza um usuário existente pelo seu ID.
   */
  @ApiParam({ name: 'id', type: String, description: 'ID do usuário' })
  @Patch(':id')
  @AllowAny()
  @CheckPolicies(ability => ability.can(Action.Update, User))
  async update(
    @Param('id') id: User['id'],
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const updatedUser = await this.usersService.update(id, updateUserDto);
    if (!updatedUser) {
      throw new NotFoundException();
    }
    return updatedUser;
  }

  /**
   * Deleta um usuário existente pelo seu ID.
   */
  @ApiParam({ name: 'id', type: String, description: 'ID do usuário' })
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
