import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AdressesService } from './adresses.service';
import { Adress } from './entities/adress.entity';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { CheckPolicies } from 'src/casl/check-policies.decorator';
import { Action } from 'src/casl/casl-ability.factory/casl-ability.factory';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(PoliciesGuard)
@Controller('adresses')
export class AdressesController {
  constructor(private readonly adressesService: AdressesService) {}

  @Get()
  @CheckPolicies(ability => ability.can(Action.List, Adress))
  async findAll(): Promise<Adress[]> {
    return await this.adressesService.findAll();
  }

  @Get(':id')
  @CheckPolicies(ability => ability.can(Action.Retrieve, Adress))
  async findOne(@Param('id') id: Adress['id']) {
    const adress = await this.adressesService.findOne(id);
    if (!adress) {
      throw new NotFoundException();
    }
    return adress;
  }
}
