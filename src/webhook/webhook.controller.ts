import { Body, Controller, Headers, Logger, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WebhookService } from './webhook.service';


@ApiTags('Webhooks')
@Controller('webhooks')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(private readonly webhookService: WebhookService) {}

  @Post('ivb')
  async handleIvbWebhook(
    @Body() dto: any,
    @Headers('x-webhook-signature') signature: string,
  ) {
    console.log('Received IVB webhook payload:', dto);
    this.logger.log(`Received IVB webhook event: ${dto.event}`);
    return this.webhookService.handleEvent(dto, signature);
  }
}
