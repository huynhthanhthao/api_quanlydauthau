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
import { CategoryModule } from './category/category.module'
import { TrashModule } from './trash/trash.module'
import { MediaModule } from './media/media.module'
import { UnitModule } from './unit/unit.module'
import { ProjectModule } from './project/project.module'
import { QuotationModule } from './quotation/quotation.module'
import { TicketModule } from './ticket/ticket.module'
import { CronModule } from './cron/cron.module'
import { ScheduleModule } from '@nestjs/schedule'
import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';
import { CompanyModule } from './company/company.module';
import { WardModule } from './ward/ward.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true
    }),
    PrismaModule.forRoot({
      isGlobal: true
    }),
    TrashModule.forRoot({
      isGlobal: true
    }),
    JwtModule.register({
      global: true,
      secret: process.env.SECRET_KEY
    }),
    ScheduleModule.forRoot(),
    CityModule,
    DistrictModule,
    AuthModule,
    ProductModule,
    CategoryModule,
    TrashModule,
    MediaModule,
    UnitModule,
    ProjectModule,
    QuotationModule,
    TicketModule,
    CronModule,
    RoleModule,
    UserModule,
    CompanyModule,
    WardModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
