import { Injectable } from '@nestjs/common';
import { Student } from '@prisma/client';
import { PrismaService } from 'src/database/prisma/prisma.service';

@Injectable()
export class StudentService {
  constructor(private readonly prismaService: PrismaService) {}

  findById(id: string): Promise<Student> {
    return this.prismaService.student.findUnique({
      where: {
        id,
      },
    });
  }

  findByAuthUserId(authUserId: string): Promise<Student> {
    return this.prismaService.student.findUnique({
      where: {
        authUserId,
      },
    });
  }

  listAll(): Promise<Student[]> {
    return this.prismaService.student.findMany();
  }
}
