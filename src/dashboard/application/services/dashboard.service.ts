import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThan } from 'typeorm';
import { DashboardResponseDto } from '../../domain/dtos/dashboard-response.dto';
import { EnrollmentsTypeOrmEntity } from '../../../enrollments/infrastructure/persistence/typeorm/enrollments.typeorm-entity';
import { LeadEntity } from '../../../leads/infrastructure/persistence/typeorm/entities/lead.typeorm-entity';
import { PaymentsTypeOrmEntity } from '../../../payments/infrastructure/persistence/typeorm/payments.typeorm-entity';
import { StudentsTypeOrmEntity } from '../../../students/infrastructure/persistence/typeorm/students.typeorm-entity';

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  constructor(
    @InjectRepository(EnrollmentsTypeOrmEntity)
    private readonly enrollmentsRepository: Repository<EnrollmentsTypeOrmEntity>,
    @InjectRepository(LeadEntity)
    private readonly leadsRepository: Repository<LeadEntity>,
    @InjectRepository(PaymentsTypeOrmEntity)
    private readonly paymentsRepository: Repository<PaymentsTypeOrmEntity>,
    @InjectRepository(StudentsTypeOrmEntity)
    private readonly studentsRepository: Repository<StudentsTypeOrmEntity>,
  ) {}

  async getSummary(): Promise<DashboardResponseDto> {
    try {
      this.logger.log('Generating dashboard summary...');

      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const firstDayOfLastMonth = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1,
      );
      const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

      // 1. Stats Queries
      const [monthlyEnrollments, lastMonthlyEnrollments] = await Promise.all([
        this.enrollmentsRepository.count({
          where: { createdAt: MoreThan(firstDayOfMonth) },
        }),
        this.enrollmentsRepository.count({
          where: {
            createdAt: Between(firstDayOfLastMonth, lastDayOfLastMonth),
          },
        }),
      ]);

      const totalLeads = await this.leadsRepository.count();

      const payments = await this.paymentsRepository.find({
        where: { createdAt: MoreThan(firstDayOfMonth) },
      });
      const monthlyRevenue = payments.reduce(
        (sum, p) => sum + Number(p.monto),
        0,
      );

      const activeStudents = await this.studentsRepository.count({
        where: { active: true },
      });

      // 2. Revenue by Method
      // For now, let's mock the distribution based on real total
      const revenueByMethod = [
        {
          method: 'Tarjeta de Crédito',
          percentage: 45,
          amount: Math.round(monthlyRevenue * 0.45),
        },
        {
          method: 'Yape',
          percentage: 35,
          amount: Math.round(monthlyRevenue * 0.35),
        },
        {
          method: 'Efectivo',
          percentage: 20,
          amount: Math.round(monthlyRevenue * 0.2),
        },
      ];

      // 3. Student Status Distribution
      // In a real scenario, you'd have more statuses. Mocking based on total.
      const studentStatusDistribution = [
        { status: 'Activos', count: activeStudents },
        { status: 'Inactivos', count: Math.round(activeStudents * 0.1) },
        { status: 'Graduados', count: Math.round(activeStudents * 0.2) },
        { status: 'En Espera', count: Math.round(activeStudents * 0.05) },
      ];

      // 4. Recent Activity
      const latestEnrollments = await this.enrollmentsRepository.find({
        take: 3,
        order: { createdAt: 'DESC' },
        relations: ['student'],
      });

      const recentActivity = latestEnrollments.map((e) => ({
        description: `Nueva matrícula: ${e.student?.nombre || 'Sin Nombre'}`,
        timeLabel: this.getTimeLabel(e.createdAt),
      }));

      // Fallback if no activity
      if (recentActivity.length === 0) {
        recentActivity.push({
          description: 'Bienvenido al nuevo sistema de gestión',
          timeLabel: 'Ahora',
        });
      }

      return {
        stats: {
          monthlyEnrollments: {
            current: monthlyEnrollments,
            trendPercentage: this.calculateTrend(
              monthlyEnrollments,
              lastMonthlyEnrollments,
            ),
            trendLabel: 'vs mes anterior',
          },
          totalLeads: {
            current: totalLeads,
            trendPercentage: 8, // Mocked trend
            trendLabel: 'en la última semana',
          },
          monthlyRevenue: {
            amount: monthlyRevenue,
            currency: 'S/.',
            trendPercentage: 5, // Mocked trend
            trendLabel: 'acumulado',
          },
          activeStudents: {
            current: activeStudents,
            avgAttendance: 95, // Mocked attendance
          },
        },
        revenueByMethod,
        studentStatusDistribution,
        recentActivity,
      };
    } catch (error) {
      this.logger.error(
        `Error generating dashboard summary: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  private calculateTrend(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  }

  private getTimeLabel(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return `Hace ${Math.floor(interval)} años`;
    interval = seconds / 2592000;
    if (interval > 1) return `Hace ${Math.floor(interval)} meses`;
    interval = seconds / 86400;
    if (interval > 1) return `Hace ${Math.floor(interval)} días`;
    interval = seconds / 3600;
    if (interval > 1) return `Hace ${Math.floor(interval)} horas`;
    interval = seconds / 60;
    if (interval > 1) return `Hace ${Math.floor(interval)} min`;
    return 'Ahora';
  }
}
