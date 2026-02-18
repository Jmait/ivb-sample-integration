import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { TransactionModule } from '../transaction/transaction.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TransactionModule, UserModule],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}
