import { UseGuards } from '@nestjs/common';
import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard } from 'src/http/auth/authorization.guard';
import { EnrollmentService } from 'src/services/enrollment.service';
import { StudentService } from 'src/services/student.service';
import { Enrollment } from '../models/enrollment';
import { Student } from '../models/student';

@Resolver(() => Student)
export class StudentsResolver {
  constructor(
    private readonly studentService: StudentService,
    private readonly enrollmentService: EnrollmentService,
  ) {}

  // @UseGuards(AuthorizationGuard)
  // @Query(() => Student)
  // me(@CurrentUser() user: AuthUser) {
  //   return this.studentService.findByAuthUserId(user.sub);
  // }

  @UseGuards(AuthorizationGuard)
  @Query(() => [Student])
  students() {
    return this.studentService.listAll();
  }

  @ResolveField(() => Enrollment)
  enrollments(@Parent() student: Student) {
    return this.enrollmentService.listByStudentId(student.id);
  }
}
