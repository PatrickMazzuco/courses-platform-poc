import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard } from 'src/http/auth/authorization.guard';
import { ProductService } from 'src/services/product.service';
import { CreateProductInput } from '../inputs/create-product.input';
import { Product } from '../models/product';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private readonly productsService: ProductService) {}

  @Query(() => [Product])
  products() {
    return this.productsService.listAll();
  }

  @UseGuards(AuthorizationGuard)
  @Mutation(() => Product)
  createProduct(@Args('data') data: CreateProductInput) {
    return this.productsService.create(data);
  }
}
