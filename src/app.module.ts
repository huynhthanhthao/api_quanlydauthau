import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { CityModule } from './city/city.module'
import { PrismaModule } from 'nestjs-prisma'
import { DistrictModule } from './district/district.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    PrismaModule.forRoot({
      isGlobal: true,
    }),
    CityModule,
    DistrictModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
