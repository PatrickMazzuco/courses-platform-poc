import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { AuthorizationGuard } from 'src/http/auth/authorization.guard';
import { AuthUser, CurrentUser } from 'src/http/auth/current-user';
import { CustomerService } from 'src/services/customer.service';
import { ProductService } from 'src/services/product.service';
import { PurchaseService } from 'src/services/purchase.service';
import { CreatePurchaseInput } from '../inputs/create-purchase.input';
import { Product } from '../models/product';
import { Purchase } from '../models/purchase';

@Resolver(() => Purchase)
export class PurchasesResolver {
  constructor(
    private readonly purchaseService: PurchaseService,
    private readonly productService: ProductService,
    private readonly customerService: CustomerService,
  ) {}

  @UseGuards(AuthorizationGuard)
  @Query(() => [Purchase])
  purchases() {
    return this.purchaseService.listAll();
  }

  @UseGuards(AuthorizationGuard)
  @Mutation(() => Purchase)
  async createPurchase(
    @CurrentUser() user: AuthUser,
    @Args('data') { productId }: CreatePurchaseInput,
  ) {
    let customer = await this.customerService.findByAuthUserId(user.sub);

    if (!customer) {
      customer = await this.customerService.create({ authUserId: user.sub });
    }

    return this.purchaseService.create({
      customerId: customer.id,
      productId,
    });
  }

  @ResolveField(() => Product)
  product(@Parent() purchase: Purchase) {
    return this.productService.findById(purchase.productId);
  }
}
