import { OmitType } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export class AddUserDto extends OmitType(CreateUserDto, ['isAdmin']) {}
