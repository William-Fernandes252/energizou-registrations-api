import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CaslModule } from 'src/casl/casl.module';
import {
  UserExistsConstraint,
  UserWithEmailAlreadyExistsConstraint,
} from './validators/constraints';
import { UserByIdPipe } from './pipes/user-by-id.pipe';

@Module({
  imports: [TypeOrmModule.forFeature([User]), CaslModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    UserWithEmailAlreadyExistsConstraint,
    UserExistsConstraint,
    UserByIdPipe,
  ],
  exports: [
    UsersService,
    UserWithEmailAlreadyExistsConstraint,
    UserExistsConstraint,
    UserByIdPipe,
  ],
})
export class UsersModule {}
