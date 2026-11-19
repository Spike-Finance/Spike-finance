import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RequireTransactionPin } from '../../common/decorators/require-transaction-pin.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { PayBillDto } from './dto/pay-bill.dto';
import { BillsService } from './bills.service';

@ApiTags('Bills')
@Controller('bills')
export class BillsController {
  constructor(private readonly billsService: BillsService) {}

  @Get('history')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get authenticated user bill payment history' })
  @ApiResponse({ status: 200, description: 'Bill payment history returned' })
  getBillHistory(@CurrentUser('sub') userId: string) {
    return this.billsService.getBillHistory(userId);
  }

  @Post('pay')
  @HttpCode(HttpStatus.OK)
  @RequireTransactionPin({ action: 'BILL_PAYMENT' })
  @ApiOperation({
    summary: 'Pay a utility or telecom bill from MAIN wallet',
    description:
      'Debits the authenticated user MAIN wallet to pay a bill (airtime, data, electricity, cable, etc.). Protected by transaction PIN authorization.',
  })
  @ApiResponse({
    status: 200,
    description: 'Bill payment completed successfully',
  })
  payBill(@CurrentUser('sub') userId: string, @Body() dto: PayBillDto) {
    return this.billsService.payBill(userId, dto);
  }
}
