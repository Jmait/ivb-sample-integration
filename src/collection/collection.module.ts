import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CollectionController } from './collection.controller';
import { CollectionService } from './collection.service';
import { TransactionModule } from '../transaction/transaction.module';

@Module({
  imports: [HttpModule, TransactionModule],
  controllers: [CollectionController],
  providers: [CollectionService],
  exports: [CollectionService],
})
export class CollectionModule {}
