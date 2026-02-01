import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiCookieAuth,
  ApiParam,
} from '@nestjs/swagger';
import { StudentsService } from '../../application/services/students.service';
import { CreateStudentDto } from '../../domain/dtos/create-student.dto';
import { UpdateStudentDto } from '../../domain/dtos/update-student.dto';
import { StudentResponseDto } from '../../domain/dtos/student-response.dto';
import { JwtAuthGuard } from '../../../authentication/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../authentication/infrastructure/guards/roles.guard';
import { Roles } from '../../../authentication/infrastructure/decorators/roles.decorator';

@ApiTags('Students')
@Controller('students')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@ApiCookieAuth()
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @Roles(1, 4) // Administrador, Secretaria
  @ApiOperation({ summary: 'Create a new student' })
  @ApiResponse({
    status: 201,
    description: 'Student created successfully',
    type: StudentResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  @ApiResponse({ status: 409, description: 'Conflict - DNI already exists' })
  async create(
    @Body() createStudentDto: CreateStudentDto,
  ): Promise<StudentResponseDto> {
    return this.studentsService.create(createStudentDto);
  }

  @Get()
  @Roles(1, 2, 3, 4) // All roles
  @ApiOperation({ summary: 'Get all students' })
  @ApiResponse({
    status: 200,
    description: 'List of all students',
    type: [StudentResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(): Promise<StudentResponseDto[]> {
    return this.studentsService.findAll();
  }

  @Get('active')
  @Roles(1, 2, 3, 4) // All roles
  @ApiOperation({ summary: 'Get all active students' })
  @ApiResponse({
    status: 200,
    description: 'List of active students',
    type: [StudentResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findActive(): Promise<StudentResponseDto[]> {
    return this.studentsService.findActive();
  }

  @Get(':id')
  @Roles(1, 2, 3, 4) // All roles
  @ApiOperation({ summary: 'Get student by ID' })
  @ApiParam({ name: 'id', description: 'Student ID', type: String })
  @ApiResponse({
    status: 200,
    description: 'Student found',
    type: StudentResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async findOne(@Param('id') id: string): Promise<StudentResponseDto> {
    return this.studentsService.findOne(id);
  }

  @Patch(':id')
  @Roles(1, 4) // Administrador, Secretaria
  @ApiOperation({ summary: 'Update student by ID' })
  @ApiParam({ name: 'id', description: 'Student ID', type: String })
  @ApiResponse({
    status: 200,
    description: 'Student updated successfully',
    type: StudentResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  @ApiResponse({ status: 404, description: 'Student not found' })
  @ApiResponse({ status: 409, description: 'Conflict - DNI already exists' })
  async update(
    @Param('id') id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ): Promise<StudentResponseDto> {
    return this.studentsService.update(id, updateStudentDto);
  }

  @Delete('all')
  @Roles(1) // Only Administrador
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete all students' })
  @ApiResponse({
    status: 204,
    description: 'All students deleted successfully',
  })
  async removeAll(): Promise<void> {
    return this.studentsService.removeAll();
  }

  @Delete(':id')
  @Roles(1) // Only Administrador
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete student by ID' })
  @ApiParam({ name: 'id', description: 'Student ID', type: String })
  @ApiResponse({ status: 204, description: 'Student deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only administrators can delete',
  })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.studentsService.remove(id);
  }
}
