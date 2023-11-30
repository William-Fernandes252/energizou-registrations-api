import { Module } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { AddressesController } from './addresses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { CaslModule } from 'src/casl/casl.module';
import AddressAlreadyExistsConstraint from './validators/constraints';

@Module({
  imports: [TypeOrmModule.forFeature([Address]), CaslModule],
  controllers: [AddressesController],
  providers: [AddressesService, AddressAlreadyExistsConstraint],
  exports: [AddressesService, AddressAlreadyExistsConstraint],
})
export class AddressesModule {}
