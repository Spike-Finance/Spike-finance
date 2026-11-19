import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
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
import { CreateSavingsLockDto } from './dto/create-savings-lock.dto';
import { SavingsService } from './savings.service';

@ApiTags('Savings')
@Controller('savings')
export class SavingsController {
  constructor(private readonly savingsService: SavingsService) {}

  @Get('pockets')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List user savings pockets' })
  @ApiResponse({ status: 200, description: 'Savings pockets returned' })
  listSavingsPockets(@CurrentUser('sub') userId: string) {
    return this.savingsService.listSavingsPockets(userId);
  }

  @Post('lock')
  @HttpCode(HttpStatus.OK)
  @RequireTransactionPin({ action: 'SAVINGS_LOCK' })
  @ApiOperation({
    summary: 'Create a locked savings pocket from MAIN wallet',
    description:
      'Debits the user MAIN wallet and locks funds into a LOCKED savings pocket. Protected by transaction PIN authorization.',
  })
  @ApiResponse({
    status: 200,
    description: 'Savings lock created successfully',
  })
  createSavingsLock(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateSavingsLockDto,
  ) {
    return this.savingsService.createSavingsLock(userId, dto);
  }

  @Post('locks/:pocketId/withdraw')
  @HttpCode(HttpStatus.OK)
  @RequireTransactionPin({ action: 'SAVINGS_LOCK_WITHDRAWAL' })
  @ApiOperation({
    summary: 'Withdraw a matured locked savings pocket to MAIN wallet',
    description:
      'Transfers funds from a matured LOCKED savings pocket back to the user MAIN wallet. Protected by transaction PIN authorization.',
  })
  @ApiResponse({
    status: 200,
    description: 'Savings lock withdrawn successfully',
  })
  withdrawSavingsLock(
    @CurrentUser('sub') userId: string,
    @Param('pocketId') pocketId: string,
  ) {
    return this.savingsService.withdrawSavingsLock(userId, pocketId);
  }
}
