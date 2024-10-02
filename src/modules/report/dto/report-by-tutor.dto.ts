import { ApiProperty } from "@nestjs/swagger";
import { StudentProjectDto } from "src/modules/students/dto/student-project.dto";

export class ReportByTutorDto {
  
  @ApiProperty({ example: 'Yavirac', description: 'Nombre de Empresa' })
  company: string;
  @ApiProperty({ example: 'Hector Gonzales', description: 'Tutor academico' })
  academicTutor: string;
  @ApiProperty({ example: 'Hector Gonzales', description: 'Tutor empresarial' })
  businessTutor: string;
  @ApiProperty({ example: StudentProjectDto, description: 'Estudiantes' })
  student: StudentProjectDto[];
}