import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CollectionModule } from './collection/collection.module';
import { UserModule } from './user/user.module';
import { WebhookModule } from './webhook/webhook.module';
import { FiatPayoutModule } from './fiat-payout/fiat-payout.module';
import { CryptoPayoutModule } from './crypto-payout/crypto-payout.module';
import { User } from './user/user.entity';
import { Transaction } from './transaction/transaction.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        entities: [User, Transaction],
        migrations: ['dist/migrations/*.js'],
        migrationsRun: true,
        synchronize: false,
      }),
    }),
    AuthModule,
    CollectionModule,
    UserModule,
    WebhookModule,
    FiatPayoutModule,
    CryptoPayoutModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
