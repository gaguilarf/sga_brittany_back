import { ApiProperty } from '@nestjs/swagger';

export class StatItemDto {
  @ApiProperty()
  current: number;

  @ApiProperty({ required: false })
  trendPercentage?: number;

  @ApiProperty({ required: false })
  trendLabel?: string;
}

export class RevenueStatDto {
  @ApiProperty()
  amount: number;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  trendPercentage: number;

  @ApiProperty()
  trendLabel: string;
}

export class ActiveStudentsStatDto {
  @ApiProperty()
  current: number;

  @ApiProperty()
  avgAttendance: number;
}

export class DashboardStatsDto {
  @ApiProperty()
  monthlyEnrollments: StatItemDto;

  @ApiProperty()
  totalLeads: StatItemDto;

  @ApiProperty()
  monthlyRevenue: RevenueStatDto;

  @ApiProperty()
  activeStudents: ActiveStudentsStatDto;
}

export class RevenueByMethodDto {
  @ApiProperty()
  method: string;

  @ApiProperty()
  percentage: number;

  @ApiProperty()
  amount: number;
}

export class StudentStatusDistributionDto {
  @ApiProperty()
  status: string;

  @ApiProperty()
  count: number;
}

export class RecentActivityDto {
  @ApiProperty()
  description: string;

  @ApiProperty()
  timeLabel: string;
}

export class DashboardResponseDto {
  @ApiProperty()
  stats: DashboardStatsDto;

  @ApiProperty({ type: [RevenueByMethodDto] })
  revenueByMethod: RevenueByMethodDto[];

  @ApiProperty({ type: [StudentStatusDistributionDto] })
  studentStatusDistribution: StudentStatusDistributionDto[];

  @ApiProperty({ type: [RecentActivityDto] })
  recentActivity: RecentActivityDto[];
}
