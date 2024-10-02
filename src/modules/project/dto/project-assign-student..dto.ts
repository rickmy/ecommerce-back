import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class AssignStudentDto {
    
    @IsNumber()
    @ApiProperty({ description: 'id proyecto', example: 1 })
    projectId: number;
    
    @IsNumber()
    @ApiProperty({ description: 'id estudiante', example: 1 })
    studentId: number;
}