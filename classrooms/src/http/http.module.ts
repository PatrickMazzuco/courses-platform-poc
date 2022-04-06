import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'src/database/database.module';
import { TestResolver } from './test.resolver';

@Module({
  imports: [ConfigModule, DatabaseModule],
  providers: [TestResolver],
})
export class HttpModule {}
