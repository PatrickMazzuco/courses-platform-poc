import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { AuthorizationGuard } from './auth/authorization.guard';

@Resolver()
export class TestResolver {
  constructor(private readonly prismaService: PrismaService) {}

  @Query(() => String)
  @UseGuards(AuthorizationGuard)
  index() {
    return 'test';
  }
}
