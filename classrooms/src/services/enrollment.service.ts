import { Injectable } from '@nestjs/common';
import { Enrollment } from '@prisma/client';
import { PrismaService } from 'src/database/prisma/prisma.service';

@Injectable()
export class EnrollmentService {
  constructor(private readonly prismaService: PrismaService) {}

  findByCourseAndStudentId(
    courseId: string,
    studentId: string,
  ): Promise<Enrollment> {
    return this.prismaService.enrollment.findFirst({
      where: {
        courseId,
        studentId,
        canceledAt: null,
      },
    });
  }

  listByStudentId(studentId: string): Promise<Enrollment[]> {
    return this.prismaService.enrollment.findMany({
      where: {
        studentId,
        canceledAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  listAll(): Promise<Enrollment[]> {
    return this.prismaService.enrollment.findMany({
      where: {
        canceledAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
