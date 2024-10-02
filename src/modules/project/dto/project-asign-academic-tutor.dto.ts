import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class AssignAcademicTutorDto {
    
    @IsNumber()
    @ApiProperty({ description: 'id proyecto', example: 1 })
    projectId: number;
  
    @IsNumber()
    @ApiProperty({ description: 'id tutor academico', example: 1 })
    academicTutorId: number;
}
 
  
  
  
  
  
  