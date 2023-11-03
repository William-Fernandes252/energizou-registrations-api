import { Module } from '@nestjs/common';
import { AdressesService } from './adresses.service';
import { AdressesController } from './adresses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Adress } from './entities/adress.entity';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [TypeOrmModule.forFeature([Adress]), CaslModule],
  controllers: [AdressesController],
  providers: [AdressesService],
  exports: [AdressesService],
})
export class AdressesModule {}
