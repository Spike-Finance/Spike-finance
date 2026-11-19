import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RequireTransactionPin } from '../../common/decorators/require-transaction-pin.decorator';
import { WalletTransferDto } from './dto/wallet-transfer.dto';
import { TransferService } from './transfer.service';

@ApiTags('Transfers')
@Controller('transfer')
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @Post('wallet')
  @HttpCode(HttpStatus.OK)
  @RequireTransactionPin({ action: 'WALLET_TRANSFER' })
  @ApiOperation({
    summary: 'Transfer funds to another Spike wallet',
    description:
      'Transfers funds from the authenticated user MAIN pocket to another user MAIN pocket. Protected by transaction PIN authorization.',
  })
  @ApiResponse({
    status: 200,
    description: 'Wallet transfer completed successfully',
  })
  transferToWallet(
    @CurrentUser('sub') userId: string,
    @Body() dto: WalletTransferDto,
  ) {
    return this.transferService.transferToWallet(userId, dto);
  }
}
