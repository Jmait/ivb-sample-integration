import { Injectable, Logger } from '@nestjs/common';
import { IvbEvent, IvbWebhookDto } from './dto/ivb-webhook.dto';
import { TransactionService } from '../transaction/transaction.service';
import { TransactionStatus } from '../transaction/transaction.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(
    private readonly transactionService: TransactionService,
    private readonly userService: UserService,
  ) {}

  async handleEvent(dto: IvbWebhookDto, signature: string) {
    switch (dto.event) {
      case IvbEvent.FIAT_COLLECTION_SUCCESS:
      case IvbEvent.CRYPTO_COLLECTION_SUCCESS:
        await this.handleCollectionSuccess(dto);
        break;
      case IvbEvent.FIAT_COLLECTION_FAILED:
      case IvbEvent.CRYPTO_COLLECTION_FAILED:
        await this.handleCollectionFailed(dto);
        break;
      case IvbEvent.FIAT_COLLECTION_PENDING:
      case IvbEvent.CRYPTO_COLLECTION_PENDING:
        await this.updateTransactionStatus(dto.data.reference, TransactionStatus.PENDING);
        this.logger.log(`Collection pending: ${dto.data.reference}`);
        break;
      case IvbEvent.FIAT_COLLECTION_PROCESSING:
      case IvbEvent.CRYPTO_COLLECTION_PROCESSING:
        await this.updateTransactionStatus(dto.data.reference, TransactionStatus.PROCESSING);
        this.logger.log(`Collection processing: ${dto.data.reference}`);
        break;
      case IvbEvent.FIAT_PAYOUT_SUCCESS:
      case IvbEvent.CRYPTO_PAYOUT_SUCCESS:
        await this.handlePayoutSuccess(dto);
        break;
      case IvbEvent.FIAT_PAYOUT_FAILED:
      case IvbEvent.CRYPTO_PAYOUT_FAILED:
        await this.handlePayoutFailed(dto);
        break;
      case IvbEvent.FIAT_PAYOUT_PENDING:
      case IvbEvent.CRYPTO_PAYOUT_PENDING:
        await this.updateTransactionStatus(dto.data.reference, TransactionStatus.PENDING);
        this.logger.log(`Payout pending: ${dto.data.reference}`);
        break;
      case IvbEvent.FIAT_PAYOUT_PROCESSING:
      case IvbEvent.CRYPTO_PAYOUT_PROCESSING:
        await this.updateTransactionStatus(dto.data.reference, TransactionStatus.PROCESSING);
        this.logger.log(`Payout processing: ${dto.data.reference}`);
        break;
    }

    return { received: true };
  }

  private async handleCollectionSuccess(dto: IvbWebhookDto) {
    const { reference, settledAmountInCrypto, token } = dto.data;

    const transaction = await this.transactionService.findByReference(reference);
    if (!transaction) {
      this.logger.warn(`Transaction not found for reference: ${reference}`);
      return;
    }

    if (transaction.status === TransactionStatus.SUCCESS) {
      this.logger.warn(`Transaction already settled: ${reference}`);
      return;
    }

    await this.transactionService.update(transaction.id, {
      status: TransactionStatus.SUCCESS,
      settledAmountInCrypto,
      token,
    });

    await this.userService.creditBalance(transaction.userId, settledAmountInCrypto);

    this.logger.log(
      `Credited ${transaction.amount} to user ${transaction.userId} for reference ${reference}`,
    );
  }

  private async handleCollectionFailed(dto: IvbWebhookDto) {
    const { reference, failureReason } = dto.data;

    const transaction = await this.transactionService.findByReference(reference);
    if (!transaction) {
      this.logger.warn(`Transaction not found for reference: ${reference}`);
      return;
    }

    await this.transactionService.update(transaction.id, {
      status: TransactionStatus.FAILED,
      failureReason: failureReason ?? undefined,
    });

    this.logger.warn(`Collection failed for reference ${reference}: ${failureReason}`);
  }

  private async handlePayoutSuccess(dto: IvbWebhookDto) {
    const { reference } = dto.data;

    const transaction = await this.transactionService.findByReference(reference);
    if (!transaction) {
      this.logger.warn(`Transaction not found for reference: ${reference}`);
      return;
    }

    if (transaction.status === TransactionStatus.SUCCESS) {
      this.logger.warn(`Payout already settled: ${reference}`);
      return;
    }

    await this.transactionService.update(transaction.id, {
      status: TransactionStatus.SUCCESS,
    });

    this.logger.log(`Payout successful for reference ${reference}`);
  }

  private async handlePayoutFailed(dto: IvbWebhookDto) {
    const { reference, failureReason } = dto.data;

    const transaction = await this.transactionService.findByReference(reference);
    if (!transaction) {
      this.logger.warn(`Transaction not found for reference: ${reference}`);
      return;
    }

    if (transaction.status === TransactionStatus.FAILED) {
      this.logger.warn(`Payout already marked as failed: ${reference}`);
      return;
    }

    await this.transactionService.update(transaction.id, {
      status: TransactionStatus.FAILED,
      failureReason: failureReason ?? undefined,
    });

    await this.userService.creditBalance(transaction.userId, transaction.amount);

    this.logger.warn(
      `Payout failed for reference ${reference}: ${failureReason}. Refunded ${transaction.amount} to user ${transaction.userId}`,
    );
  }

  private async updateTransactionStatus(reference: string, status: TransactionStatus) {
    const transaction = await this.transactionService.findByReference(reference);
    if (transaction) {
      await this.transactionService.update(transaction.id, { status });
    }
  }
}
