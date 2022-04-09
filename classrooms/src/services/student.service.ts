import { Injectable } from '@nestjs/common';
import { Student } from '@prisma/client';
import { PrismaService } from 'src/database/prisma/prisma.service';

type CreateStudentParams = {
  authUserId: string;
};

@Injectable()
export class StudentService {
  constructor(private readonly prismaService: PrismaService) {}

  async create({ authUserId }: CreateStudentParams): Promise<Student> {
    return this.prismaService.student.create({
      data: {
        authUserId,
      },
    });
  }

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
