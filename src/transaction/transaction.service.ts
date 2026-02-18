import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  create(data: Partial<Transaction>): Promise<Transaction> {
    const transaction = this.transactionRepository.create(data);
    return this.transactionRepository.save(transaction);
  }

  findByReference(reference: string): Promise<Transaction | null> {
    return this.transactionRepository.findOne({
      where: { reference },
      relations: ['user'],
    });
  }

  async update(id: number, data: Partial<Transaction>): Promise<Transaction> {
    await this.transactionRepository.update(id, data);
    return this.transactionRepository.findOneByOrFail({ id });
  }
}
