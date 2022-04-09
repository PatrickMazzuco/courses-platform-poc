import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'src/database/database.module';
import { MessagingModule } from 'src/messaging/messaging.module';
import { CustomerService } from 'src/services/customer.service';
import { ProductService } from 'src/services/product.service';
import { PurchaseService } from 'src/services/purchase.service';
import { CustomersResolver } from './graphql/resolvers/customer.resolver';
import { ProductsResolver } from './graphql/resolvers/products.resolver';
import { PurchasesResolver } from './graphql/resolvers/purchases.resolver';

@Module({
  imports: [ConfigModule, DatabaseModule, MessagingModule],
  providers: [
    // Resolvers
    ProductsResolver,
    PurchasesResolver,
    CustomersResolver,
    // Services
    ProductService,
    PurchaseService,
    CustomerService,
  ],
})
export class HttpModule {}
