import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { DashboardService } from '../../application/services/dashboard.service';
import { DashboardResponseDto } from '../../domain/dtos/dashboard-response.dto';
import { JwtAuthGuard } from '../../../authentication/infrastructure/guards/jwt-auth.guard';

@ApiTags('Dashboard')
@Controller('dashboard')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiCookieAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get dashboard summary data' })
  @ApiResponse({
    status: 200,
    description: 'Dashboard summary data',
    type: DashboardResponseDto,
  })
  async getSummary(): Promise<DashboardResponseDto> {
    return this.dashboardService.getSummary();
  }
}
