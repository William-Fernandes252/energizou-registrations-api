import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 20;

export class PageOptionsDto {
  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
    description: 'Pagina que deve ser retornada (iniciando em 1).',
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page: number = 1;

  @ApiPropertyOptional({
    minimum: 1,
    default: DEFAULT_LIMIT,
    maximum: MAX_LIMIT,
    description: 'Quantidade de registros por página.',
  })
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  readonly limit: number = 20;
}
