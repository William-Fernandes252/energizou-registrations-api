import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  NotFoundException,
  HttpCode,
  HttpStatus,
  UseGuards,
  Post,
  SerializeOptions,
  UnprocessableEntityException,
  Query,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company, Groups } from './entities/company.entity';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { CheckPolicies } from 'src/casl/check-policies.decorator';
import { Action } from 'src/casl/casl-ability.factory';
import { RegisterCompanyDto } from './dto/register-company.dto';
import { PageOptionsDto } from 'src/common/dto/pageOptions.dto';
import { CnpjValidationPipe } from 'src/companies/pipes/cnpj-validation.pipe';
import {
  ApiExtraModels,
  ApiTags,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { DEFAULT_SECURITY_SCHEME } from 'src/config/auth.config';

@ApiTags('companies')
@ApiBearerAuth(DEFAULT_SECURITY_SCHEME.apiName)
@ApiExtraModels(RegisterCompanyDto, UpdateCompanyDto)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('companies')
@UseGuards(PoliciesGuard)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  /**
   * Seleciona uma página de clientes.
   * @param pageOptionsDto
   */
  @Get()
  @CheckPolicies(ability => ability.can(Action.List, Company))
  @SerializeOptions({ groups: [Groups.List] })
  async findAll(
    @Query()
    pageOptionsDto: PageOptionsDto<Pick<Company, 'reason' | 'created'>>,
  ) {
    return await this.companiesService.findAll(pageOptionsDto);
  }

  /**
   * Busca um cliente pelo CNPJ cadastrado.
   * @param cnpj
   * @returns `Company` se encontrado, `null` caso contrário
   */
  @ApiParam({ name: 'cnpj', type: String, description: 'CNPJ cadastrado' })
  @Get(':cnpj')
  @CheckPolicies(ability => ability.can(Action.Retrieve, Company))
  @SerializeOptions({ groups: [Groups.Detail] })
  async findOne(
    @Param('cnpj', CnpjValidationPipe) cnpj: Company['cnpj'],
  ): Promise<Company> {
    const company = await this.companiesService.findOne(cnpj);
    if (!company) {
      throw new NotFoundException();
    }
    return company;
  }

  /**
   * Atualiza as informações de um cliente pelo ID.
   * @param id
   * @param updateCompanyDto
   */
  @ApiParam({ name: 'id', type: String, description: 'ID do cliente' })
  @Patch(':id')
  @CheckPolicies(ability => ability.can(Action.Update, Company))
  @SerializeOptions({ groups: [Groups.Detail] })
  async update(
    @Param('id') id: Company['id'],
    @Body() updateCompanyDto: UpdateCompanyDto,
  ): Promise<Company> {
    let company: Company;
    try {
      company = await this.companiesService.update(id, updateCompanyDto);
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }

    if (!company) {
      throw new NotFoundException();
    }

    return company;
  }

  /**
   * Remove um cliente pelo ID.
   */
  @ApiParam({ name: 'id', type: String, description: 'ID do cliente' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @CheckPolicies(ability => ability.can(Action.Delete, Company))
  async remove(@Param('id') id: Company['id']): Promise<void> {
    const company = await this.companiesService.remove(id);
    if (!company) {
      throw new NotFoundException();
    }
  }

  /**
   * Registra um novo cliente.
   * @param registrationDto
   */
  @Post('register')
  @CheckPolicies(ability => ability.can(Action.Create, Company))
  @SerializeOptions({ groups: [Groups.Detail] })
  async register(@Body() registrationDto: RegisterCompanyDto) {
    return await this.companiesService.register(registrationDto);
  }
}
