import { UseGuards } from '@nestjs/common';
import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard } from 'src/http/auth/authorization.guard';
import { CourseService } from 'src/services/course.service';
import { EnrollmentService } from 'src/services/enrollment.service';
import { StudentService } from 'src/services/student.service';
import { Course } from '../models/course';
import { Enrollment } from '../models/enrollment';
import { Student } from '../models/student';

@Resolver(() => Enrollment)
export class EnrollmentsResolver {
  constructor(
    private readonly enrollmentService: EnrollmentService,
    private readonly studentService: StudentService,
    private readonly courseService: CourseService,
  ) {}

  @UseGuards(AuthorizationGuard)
  @Query(() => [Enrollment])
  enrollments() {
    return this.enrollmentService.listAll();
  }

  @ResolveField(() => Student)
  student(@Parent() enrollment: Enrollment) {
    return this.studentService.findById(enrollment.studentId);
  }

  @ResolveField(() => Course)
  course(@Parent() enrollment: Enrollment) {
    return this.courseService.findById(enrollment.courseId);
  }
}
