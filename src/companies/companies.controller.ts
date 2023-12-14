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
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company, Groups } from './entities/company.entity';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { CheckPolicies } from 'src/casl/check-policies.decorator';
import { Action } from 'src/casl/casl-ability.factory';
import { RegisterCompanyDto } from './dto/register-company.dto';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';
import { CnpjValidationPipe } from 'src/companies/pipes/cnpj-validation.pipe';
import {
  ApiExtraModels,
  ApiTags,
  ApiParam,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { DEFAULT_SECURITY_SCHEME } from 'src/config/auth.config';
import { AddUserDto } from './dto/add-user.dto';
import { CompanyByCnpjPipe } from './pipes/company-by-cnpj.pipe';
import {
  type Sorting,
  SortingParams,
} from 'src/common/decorators/sorting-params.decorator';
import { ConfigService } from '@nestjs/config';

@ApiTags('companies')
@ApiBearerAuth(DEFAULT_SECURITY_SCHEME.apiName)
@ApiExtraModels(RegisterCompanyDto, UpdateCompanyDto)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('companies')
@UseGuards(PoliciesGuard)
export class CompaniesController {
  constructor(
    private readonly companiesService: CompaniesService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Seleciona uma página de clientes.
   * @param pagination
   */
  @Get()
  @CheckPolicies(ability => ability.can(Action.List, Company))
  @SerializeOptions({ groups: [Groups.List] })
  @ApiQuery({
    name: 'search',
    type: String,
    required: false,
    description: 'Busca por razão social, CNPJ ou nome do representante.',
  })
  @ApiQuery({
    name: 'sort',
    type: String,
    required: false,
    description: 'Ordenação. Ex: "reason:ASC".',
  })
  async findAll(
    @Query()
    pagination: PageOptionsDto,
    @SortingParams(['reason', 'created']) sorting: Sorting,
    @Query('search') search?: string,
  ) {
    return await this.companiesService.findAll(
      {
        ...pagination,
        route: `${this.configService.get<string>('BASE_URL')}/companies`,
      },
      sorting,
      search,
    );
  }

  /**
   * Busca um cliente pelo CNPJ cadastrado.
   * @param cnpj
   * @returns `Company` se encontrado, `null` caso contrário
   */
  @ApiParam({ name: 'cnpj', type: String, description: 'CNPJ cadastrado.' })
  @Get(':cnpj')
  @CheckPolicies(ability => ability.can(Action.Retrieve, Company))
  @SerializeOptions({ groups: [Groups.Detail] })
  async findOne(
    @Param('cnpj', CnpjValidationPipe) cnpj: Company['cnpj'],
  ): Promise<Company> {
    const company = await this.companiesService.findOneByCNPJ(cnpj);
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
  @ApiParam({ name: 'cnpj', type: String, description: 'CNPJ do cliente.' })
  @Patch(':cnpj')
  @CheckPolicies(ability => ability.can(Action.Update, Company))
  @SerializeOptions({ groups: [Groups.Detail] })
  async update(
    @Param('cnpj', CnpjValidationPipe, CompanyByCnpjPipe) company: Company,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ): Promise<Company> {
    return this.companiesService.update(company, updateCompanyDto);
  }

  /**
   * Remove um cliente pelo ID.
   */
  @ApiParam({ name: 'cnpj', type: String, description: 'CNPJ do cliente.' })
  @Delete(':cnpj')
  @HttpCode(HttpStatus.NO_CONTENT)
  @CheckPolicies(ability => ability.can(Action.Delete, Company))
  async remove(
    @Param('cnpj', CnpjValidationPipe, CompanyByCnpjPipe) company: Company,
  ): Promise<void> {
    await this.companiesService.remove(company);
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

  @ApiParam({ name: 'cnpj', type: String, description: 'CNPJ do cliente.' })
  @Post(':cnpj/users')
  @CheckPolicies(ability => ability.can(Action.Update, Company))
  @SerializeOptions({ groups: [Groups.Detail] })
  async addUser(
    @Param('cnpj', CnpjValidationPipe, CompanyByCnpjPipe) company: Company,
    @Body() addUserDto: AddUserDto,
  ) {
    return await this.companiesService.addUser(company, addUserDto);
  }
}
