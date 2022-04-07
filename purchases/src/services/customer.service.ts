import { Injectable } from '@nestjs/common';
import { Customer } from '@prisma/client';
import { PrismaService } from 'src/database/prisma/prisma.service';

type CreateCustomerParams = {
  authUserId: string;
};

@Injectable()
export class CustomerService {
  constructor(private readonly prismaService: PrismaService) {}

  async create({ authUserId }: CreateCustomerParams): Promise<Customer> {
    return this.prismaService.customer.create({
      data: {
        authUserId,
      },
    });
  }

  findByAuthUserId(authUserId: string): Promise<Customer> {
    return this.prismaService.customer.findUnique({
      where: {
        authUserId,
      },
    });
  }
}
