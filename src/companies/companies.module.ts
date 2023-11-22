import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { UsersModule } from 'src/users/users.module';
import { AddressesModule } from 'src/addresses/addresses.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [
    UsersModule,
    AddressesModule,
    CaslModule,
    TypeOrmModule.forFeature([Company]),
  ],
  controllers: [CompaniesController],
  providers: [CompaniesService],
})
export class CompaniesModule {}
