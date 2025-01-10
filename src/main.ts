import { HttpAdapterHost, NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { AppModule } from './app.module'
import { json, static as static_ } from 'express'
import { PrismaClientExceptionFilter } from 'nestjs-prisma'
import { ValidationPipe } from '@nestjs/common'
import { TransformInterceptor } from 'utils/api-response'

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule)
    const cfgService = app.get(ConfigService)
    const { httpAdapter } = app.get(HttpAdapterHost)

    app.enableCors()
    app.use('/uploads', static_('uploads'))
    app.use(json({ limit: '2mb' }))
    app.useGlobalInterceptors(new TransformInterceptor())
    app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter))
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        skipMissingProperties: false,
        disableErrorMessages: false,
        skipNullProperties: false
      })
    )

    await app.listen(cfgService.get<number>('PORT'))
  } catch (error) {
    console.log(error)
  }
}
bootstrap()
