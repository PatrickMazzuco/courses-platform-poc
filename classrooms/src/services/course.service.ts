import { BadRequestException, Injectable } from '@nestjs/common';
import { Course } from '@prisma/client';
import slugify from 'slugify';
import { PrismaService } from 'src/database/prisma/prisma.service';

type CreateCourseParams = {
  slug?: string;
  title: string;
};

@Injectable()
export class CourseService {
  constructor(private readonly prismaService: PrismaService) {}

  async create({ title, slug }: CreateCourseParams): Promise<Course> {
    const courseSlug = slug ?? slugify(title, { lower: true });

    const courseWithSameSlug = await this.prismaService.course.findUnique({
      where: {
        slug: courseSlug,
      },
    });

    if (courseWithSameSlug) {
      throw new BadRequestException('Course with same slug already exists');
    }

    return this.prismaService.course.create({
      data: {
        slug: courseSlug,
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

  findBySlug(slug: string): Promise<Course> {
    return this.prismaService.course.findUnique({
      where: {
        slug,
      },
    });
  }

  listAll(): Promise<Course[]> {
    return this.prismaService.course.findMany();
  }
}
