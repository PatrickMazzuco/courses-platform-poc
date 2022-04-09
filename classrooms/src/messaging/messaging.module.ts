import { Module } from '@nestjs/common';
import { HttpModule } from 'src/http/http.module';
import { PurchaseController } from './controllers/purchases.controller';

@Module({
  imports: [HttpModule],
  controllers: [PurchaseController],
  providers: [],
  exports: [],
})
export class MessagingModule {}
