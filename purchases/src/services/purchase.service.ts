import { Injectable, NotFoundException } from '@nestjs/common';
import { Purchase } from '@prisma/client';
import { PrismaService } from 'src/database/prisma/prisma.service';

type CreatePurchaseParams = {
  productId: string;
  customerId: string;
};

@Injectable()
export class PurchaseService {
  constructor(private readonly prismaService: PrismaService) {}

  listAll(): Promise<Purchase[]> {
    return this.prismaService.purchase.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  listAllFromCustomer(customerId: string): Promise<Purchase[]> {
    return this.prismaService.purchase.findMany({
      where: {
        customerId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async create({
    customerId,
    productId,
  }: CreatePurchaseParams): Promise<Purchase> {
    const existingProduct = await this.prismaService.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }

    return this.prismaService.purchase.create({
      data: {
        customerId,
        productId,
      },
    });
  }
}
