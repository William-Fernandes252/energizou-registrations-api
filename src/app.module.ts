import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './config/database.config';
import authConfig from './config/auth.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';
import { AdressesModule } from './adresses/adresses.module';
import { AppController } from './app.controller';
import { CaslModule } from './casl/casl.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig, authConfig],
      envFilePath: [
        `.env.${process.env.NODE_ENV}`,
        `.env.${process.env.NODE_ENV}.local`,
      ],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
        autoLoadEntities: true,
      }),
    }),
    UsersModule,
    CompaniesModule,
    AdressesModule,
    CaslModule,
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
