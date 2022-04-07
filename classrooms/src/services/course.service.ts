import { BadRequestException, Injectable } from '@nestjs/common';
import { Course } from '@prisma/client';
import slugify from 'slugify';
import { PrismaService } from 'src/database/prisma/prisma.service';

type CreateCourseParams = {
  title: string;
};

@Injectable()
export class CourseService {
  constructor(private readonly prismaService: PrismaService) {}

  async create({ title }: CreateCourseParams): Promise<Course> {
    const slug = slugify(title, { lower: true });

    const courseWithSameSlug = await this.prismaService.course.findUnique({
      where: {
        slug,
      },
    });

    if (courseWithSameSlug) {
      throw new BadRequestException('Course with same slug already exists');
    }

    return this.prismaService.course.create({
      data: {
        slug,
        title,
      },
    });
  }

  findById(id: string): Promise<Course> {
    return this.prismaService.course.findUnique({
      where: {
        id,
      },
    });
  }

  listAll(): Promise<Course[]> {
    return this.prismaService.course.findMany();
  }
}
