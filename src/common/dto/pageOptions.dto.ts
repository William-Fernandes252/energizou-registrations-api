import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Order } from 'src/common/enums';

export class PageOptionsDto<T extends Record<string, unknown>> {
  /*
   * Ordem dos registros (`ASC` ou `DESC`).
   */
  @IsEnum(Order)
  @IsOptional()
  readonly order?: Order = Order.ASC;

  /**
   * Campo que deve ser utilizado para ordenar os registros.
   */
  @IsOptional()
  readonly sort?: keyof T;

  /**
   * Página que deve ser retornada (iniciando em 1).
   */
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page: number = 1;

  /**
   * Quantidade máxima de registros por página.
   */
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  readonly limit: number = 20;
}
