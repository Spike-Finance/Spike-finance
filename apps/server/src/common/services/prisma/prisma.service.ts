import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@spike/database';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger('PRISMA SERVICE');
  async onModuleInit() {
    await this.$connect();
    this.logger.log('Prisma connected successfully');
  }
  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Prisma disconnected successfully');
  }
}
