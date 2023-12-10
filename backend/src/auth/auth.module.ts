import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { ConfigService, ConfigModule} from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([User]), 
    ConfigModule,
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        // secret: "PutainDeSesMorts",
        signOptions: { expiresIn: '60s' },
      }),
      inject: [ConfigService],
    }),
  ],
  // Tip: Do not provide JwtService here, it angers the Machine God.
  // (and fuck up the Jwt secret somehow...)
  providers: [AuthService, {provide: APP_GUARD, useClass: AuthGuard}],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
