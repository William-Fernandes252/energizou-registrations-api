import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { Address } from './entities/address.entity';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { CheckPolicies } from 'src/casl/check-policies.decorator';
import { Action } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('addresses')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(PoliciesGuard)
@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  /**
   * Retorna todos os endereços cadastrados.
   */
  @Get()
  @CheckPolicies(ability => ability.can(Action.List, Address))
  async findAll(): Promise<Address[]> {
    return await this.addressesService.findAll();
  }

  /**
   * Busca um endereço pelo seu ID.
   */
  @ApiParam({ name: 'id', type: String, description: 'ID do endereço' })
  @Get(':id')
  @CheckPolicies(ability => ability.can(Action.Retrieve, Address))
  async findOne(@Param('id') id: Address['id']) {
    const address = await this.addressesService.findOne(id);
    if (!address) {
      throw new NotFoundException();
    }
    return address;
  }
}
