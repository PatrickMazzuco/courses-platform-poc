import { Injectable, NotFoundException } from '@nestjs/common';
import { Purchase } from '@prisma/client';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { KafkaService } from 'src/messaging/kafka.service';

type CreatePurchaseParams = {
  productId: string;
  customerId: string;
};

@Injectable()
export class PurchaseService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly kafkaService: KafkaService,
  ) {}

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

    const createdPurchase = await this.prismaService.purchase.create({
      data: {
        customerId,
        productId,
      },
    });

    const customer = await this.prismaService.customer.findUnique({
      where: {
        id: customerId,
      },
    });

    this.kafkaService.emit('purchases.new-purchase', {
      customer: {
        authUserId: customer.authUserId,
      },
      product: {
        id: productId,
        title: existingProduct.title,
        slug: existingProduct.slug,
      },
    });

    return createdPurchase;
  }
}
