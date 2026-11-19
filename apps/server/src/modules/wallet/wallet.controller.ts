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
import { WalletTransferDto } from '../transfer/dto/wallet-transfer.dto';
import { WalletService } from './wallet.service';

@ApiTags('Wallet')
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('balance')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get authenticated user main wallet balance' })
  @ApiResponse({ status: 200, description: 'Wallet balance returned' })
  getBalance(@CurrentUser('sub') userId: string) {
    return this.walletService.getWalletBalance(userId);
  }

  @Post('transfer')
  @HttpCode(HttpStatus.OK)
  @RequireTransactionPin({ action: 'WALLET_TRANSFER' })
  @ApiOperation({
    summary: 'Initiate a wallet-to-wallet transfer',
    description:
      'Transfers funds from the user MAIN wallet to a recipient wallet. Protected by transaction PIN authorization.',
  })
  @ApiResponse({
    status: 200,
    description: 'Wallet transfer completed successfully',
  })
  transfer(
    @CurrentUser('sub') userId: string,
    @Body() dto: WalletTransferDto,
  ) {
    return this.walletService.transfer(userId, dto);
  }
}
