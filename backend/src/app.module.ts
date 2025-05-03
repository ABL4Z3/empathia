import { Module } from '@nestjs/common';
import { AppGateway } from './app.gateway';
import { VentingLoungeGateway } from './venting-lounge.gateway';
import { GenerationsConnectGateway } from './generations-connect.gateway';
import { GratitudeChainGateway } from './gratitude-chain.gateway';

@Module({
  imports: [],
  controllers: [],
  providers: [AppGateway, VentingLoungeGateway, GenerationsConnectGateway, GratitudeChainGateway],
})
export class AppModule {}
