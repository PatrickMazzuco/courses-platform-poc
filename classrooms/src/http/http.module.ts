import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'src/database/database.module';
import { CourseService } from 'src/services/course.service';
import { EnrollmentService } from 'src/services/enrollment.service';
import { StudentService } from 'src/services/student.service';
import { CoursesResolver } from './graphql/resolvers/courses.resolver';
import { EnrollmentsResolver } from './graphql/resolvers/enrollments.resolver';
import { StudentsResolver } from './graphql/resolvers/students.resolver';

@Module({
  imports: [ConfigModule, DatabaseModule],
  providers: [
    StudentsResolver,
    EnrollmentsResolver,
    CoursesResolver,
    StudentService,
    EnrollmentService,
    CourseService,
  ],
})
export class HttpModule {}
