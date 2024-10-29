import { ApiProperty } from '@nestjs/swagger';

export class ResponseAuthModel {
  @ApiProperty({
    description: 'Token de acceso',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  accessToken: string;
}
