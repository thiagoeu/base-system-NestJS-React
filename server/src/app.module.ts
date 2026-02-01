import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfigAsync } from './config/typeorm.config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { HeaderResolver, I18nJsonLoader, I18nModule } from 'nestjs-i18n';
import { join } from 'path';
import { existsSync } from 'fs';

const i18nPath = existsSync(join(__dirname, 'shared/i18n'))
  ? join(__dirname, 'shared/i18n') // dev: src/shared/i18n
  : join(__dirname, '../shared/i18n'); // prod: dist/shared/i18n

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'pt',
      loader: I18nJsonLoader,
      loaderOptions: {
        path: i18nPath,
        watch: true,
      },
      resolvers: [
        { use: HeaderResolver, options: ['x-custom-lang', 'accept-language'] },
      ],
    }),
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
