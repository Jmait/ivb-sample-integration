import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }

  create(user: Partial<User>): Promise<User> {
    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  async creditBalance(userId: number, amount: number): Promise<User> {
    await this.userRepository.increment({ id: userId }, 'balance', amount);
    return this.userRepository.findOneByOrFail({ id: userId });
  }

  async debitBalance(userId: number, amount: number): Promise<User> {
    const user = await this.userRepository.findOneByOrFail({ id: userId });
    if (Number(user.balance) < amount) {
      throw new BadRequestException('Insufficient balance');
    }
    await this.userRepository.decrement({ id: userId }, 'balance', amount);
    return this.userRepository.findOneByOrFail({ id: userId });
  }
}
