import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CourseService } from 'src/services/course.service';
import { EnrollmentService } from 'src/services/enrollment.service';
import { StudentService } from 'src/services/student.service';

type Customer = {
  authUserId: string;
};

type Product = {
  id: string;
  title: string;
  slug: string;
};

type PurchaseCreatedPayload = {
  customer: Customer;
  product: Product;
};

@Controller()
export class PurchaseController {
  constructor(
    private readonly enrollmentService: EnrollmentService,
    private readonly studentService: StudentService,
    private readonly courseService: CourseService,
  ) {}

  @EventPattern('purchases.new-purchase')
  async purchaseCreated(
    @Payload('value') { customer, product }: PurchaseCreatedPayload,
  ) {
    let student = await this.studentService.findByAuthUserId(
      customer.authUserId,
    );

    if (!student) {
      student = await this.studentService.create({
        authUserId: customer.authUserId,
      });
    }

    let course = await this.courseService.findBySlug(product.slug);

    if (!course) {
      course = await this.courseService.create({
        title: product.title,
        slug: product.slug,
      });
    }

    await this.enrollmentService.create({
      courseId: course.id,
      studentId: student.id,
    });
  }
}
