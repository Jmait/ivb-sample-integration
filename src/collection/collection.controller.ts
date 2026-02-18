import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CollectionService } from './collection.service';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';

@ApiTags('Collections')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('collections')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Post('initiate-payment')
  initiatePayment(@Body() dto: InitiatePaymentDto, @Req() req: any) {
    return this.collectionService.initiatePayment(dto, req.user.id);
  }
}
