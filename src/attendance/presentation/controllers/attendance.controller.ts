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
import { AttendanceService } from '../../application/services/attendance.service';
import { CreateAttendanceDto } from '../../domain/dtos/create-attendance.dto';
import { UpdateAttendanceDto } from '../../domain/dtos/update-attendance.dto';
import { AttendanceResponseDto } from '../../domain/dtos/attendance-response.dto';
import { JwtAuthGuard } from '../../../authentication/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../authentication/infrastructure/guards/roles.guard';
import { Roles } from '../../../authentication/infrastructure/decorators/roles.decorator';

@ApiTags('Attendance')
@Controller('attendance')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@ApiCookieAuth()
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  @Roles(1, 2, 4) // Admin, Teacher, Secretary
  @ApiOperation({ summary: 'Record student attendance' })
  @ApiResponse({ status: 201, type: AttendanceResponseDto })
  async create(
    @Body() createAttendanceDto: CreateAttendanceDto,
  ): Promise<AttendanceResponseDto> {
    return this.attendanceService.create(createAttendanceDto);
  }

  @Get()
  @Roles(1, 2, 3, 4)
  @ApiOperation({ summary: 'Get all attendance records' })
  @ApiResponse({ status: 200, type: [AttendanceResponseDto] })
  async findAll(): Promise<AttendanceResponseDto[]> {
    return this.attendanceService.findAll();
  }

  @Get(':id')
  @Roles(1, 2, 3, 4)
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: AttendanceResponseDto })
  async findOne(@Param('id') id: string): Promise<AttendanceResponseDto> {
    return this.attendanceService.findOne(id);
  }

  @Patch(':id')
  @Roles(1, 2, 4)
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: AttendanceResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateAttendanceDto: UpdateAttendanceDto,
  ): Promise<AttendanceResponseDto> {
    return this.attendanceService.update(id, updateAttendanceDto);
  }

  @Delete(':id')
  @Roles(1)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({ name: 'id', type: String })
  async remove(@Param('id') id: string): Promise<void> {
    return this.attendanceService.remove(id);
  }
}
