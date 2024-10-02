import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class AssignBusinessTutorDto{
  
    @IsNumber()
    @ApiProperty({ description: 'id proyecto', example: 1 })
    projectId: number;
   
    @IsNumber()
    @ApiProperty({ description: 'id tutor empresarial', example: 1 })
    businessTutorId: number;
}