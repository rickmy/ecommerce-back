import { AcademicTutor } from "./project-academic-tutor.dto";
import { BusinessTutor } from "./project-businessTutor.dto";
import { ProjectStudents } from "./project-students.dto";
import { ProjectCompany } from "./project-company.dto";
import { ApiProperty } from "@nestjs/swagger";
import { StatusProject } from "@prisma/client";
export class ProjectInfoDto{

    @ApiProperty({ example: '1', description: 'Id proyecto' })
    id: number;
    @ApiProperty({ example: 'Yavi Soft', description: 'Nombre del proyecto' })
    name: string;
    @ApiProperty({ example: 'El Proyecto trata sobre...', description: 'Descripcion del proyecto' })
    description: string;
    @ApiProperty({ type: BusinessTutor, description: 'Tutor empresarial asignado al proyecto' })
    businessTutor: BusinessTutor;
    @ApiProperty({ type: AcademicTutor, description: 'Tutor academico asignado al proyecto' })
    academicTutor: AcademicTutor;
    @ApiProperty({ type: ProjectCompany, description: 'Empresa asignada al proyecto' })
    company: ProjectCompany;
    @ApiProperty({ type: [ProjectStudents], description: 'Estudiantes asignados al proyecto' })
    students: ProjectStudents[];
    @ApiProperty({ example: StatusProject.ACTIVO , description: 'estado del proyecto' })
    status: StatusProject;
}