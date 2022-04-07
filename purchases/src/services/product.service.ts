import { BadRequestException, Injectable } from '@nestjs/common';
import { Product } from '@prisma/client';
import slugify from 'slugify';
import { PrismaService } from 'src/database/prisma/prisma.service';

type CreateProductParams = {
  title: string;
};

@Injectable()
export class ProductService {
  constructor(private readonly prismaService: PrismaService) {}

  findById(id: string): Promise<Product> {
    return this.prismaService.product.findUnique({
      where: {
        id,
      },
    });
  }

  listAll(): Promise<Product[]> {
    return this.prismaService.product.findMany();
  }

  async create({ title }: CreateProductParams): Promise<Product> {
    const slug = slugify(title, { lower: true });

    const productWithSameSlug = await this.prismaService.product.findUnique({
      where: {
        slug,
      },
    });

    if (productWithSameSlug) {
      throw new BadRequestException('Product with same slug already exists');
    }

    return this.prismaService.product.create({
      data: {
        slug,
        title,
      },
    });
  }
}
