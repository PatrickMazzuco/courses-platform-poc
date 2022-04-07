import { NotFoundException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ForbiddenError } from 'apollo-server-express';
import { AuthorizationGuard } from 'src/http/auth/authorization.guard';
import { AuthUser, CurrentUser } from 'src/http/auth/current-user';
import { CourseService } from 'src/services/course.service';
import { EnrollmentService } from 'src/services/enrollment.service';
import { StudentService } from 'src/services/student.service';
import { CreateCourseInput } from '../inputs/create-course.input';
import { Course } from '../models/course';

@Resolver(() => Course)
export class CoursesResolver {
  constructor(
    private readonly courseService: CourseService,
    private readonly studentService: StudentService,
    private readonly enrollmentService: EnrollmentService,
  ) {}

  @UseGuards(AuthorizationGuard)
  @Query(() => [Course])
  courses() {
    return this.courseService.listAll();
  }

  @UseGuards(AuthorizationGuard)
  @Query(() => Course)
  async course(@Args('id') id: string, @CurrentUser() user: AuthUser) {
    const student = await this.studentService.findByAuthUserId(user.sub);

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const enrollment = await this.enrollmentService.findByCourseAndStudentId(
      id,
      student.id,
    );

    if (!enrollment) {
      throw new ForbiddenError('Student is not enrolled in this course');
    }

    return this.courseService.findById(id);
  }

  @UseGuards(AuthorizationGuard)
  @Mutation(() => Course)
  createCourse(@Args('data') data: CreateCourseInput) {
    return this.courseService.create(data);
  }
}
