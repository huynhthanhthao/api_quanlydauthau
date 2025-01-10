import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { CityModule } from './city/city.module'
import { PrismaModule } from 'nestjs-prisma'
import { DistrictModule } from './district/district.module'
import { AuthModule } from './auth/auth.module'
import { JwtModule } from '@nestjs/jwt'
import { ProductModule } from './product/product.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    PrismaModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.SECRET_KEY,
    }),
    CityModule,
    DistrictModule,
    AuthModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
