import { TutorDto } from "src/modules/tutor/dto/tutor.dto";
import { StudentProjectDto } from "src/modules/students/dto/student-project.dto";
import { ApiProperty } from "@nestjs/swagger";
import { isArray } from "class-validator";

export class ReportCompanyDto{

    
    @ApiProperty({ example: 'Yavi Soft', description: 'Nombre de Empresa' })
    company: string;
    @ApiProperty({ example: 'Alberto Espinoza', description: 'Tutor academico' })
    academicTutor: string;
    @ApiProperty({ example: 'Juan Rios', description: 'Tutor empresarial' })
    businessTutor: string;
    @ApiProperty({ example: [StudentProjectDto], description: 'Estudiantes' })
    students: StudentProjectDto[];
}