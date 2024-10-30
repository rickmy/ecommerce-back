import { ApiProperty } from '@nestjs/swagger';

export class PaginationResult<T> {
  @ApiProperty({ example: [], description: 'Resultados' })
  results: T[];
  @ApiProperty({ example: 1, description: 'Total de resultados' })
  total: number;
  @ApiProperty({ example: 1, description: 'Página actual' })
  page: number;
  @ApiProperty({ example: 1, description: 'Total de páginas' })
  limit: number;

  constructor(results: T[], total: number, page: number, limit: number) {
    this.results = results;
    this.total = total;
    this.page = page;
    this.limit = limit;
  }
}
