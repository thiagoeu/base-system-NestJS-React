import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';

import { I18nService } from 'nestjs-i18n';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private i18n: I18nService,

    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

    await this.refreshTokenRepository.upsert(
      {
        user: { id: user.id },
        tokenHash: refreshTokenHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      ['user'],
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshAccessToken(
    refreshToken: string,
    lang?: string,
  ): Promise<string> {
    try {
      const payload = this.jwtService.verify(refreshToken);

      const storedToken = await this.refreshTokenRepository.findOne({
        where: { user: { id: payload.sub } },
        relations: ['user'],
      });

      if (!storedToken) {
        const msg = await this.i18n.translate('auth.refreshTokenNotFound', {
          lang,
        });
        throw new UnauthorizedException(msg);
      }

      const isValid = await bcrypt.compare(refreshToken, storedToken.tokenHash);

      if (!isValid) {
        const msg = await this.i18n.translate('auth.invalidRefreshToken', {
          lang,
        });
        throw new UnauthorizedException(msg);
      }

      const newAccessToken = this.jwtService.sign(
        { sub: payload.sub, email: payload.email },
        { expiresIn: '15m' },
      );

      return newAccessToken;
    } catch {
      const msg = await this.i18n.translate('auth.invalidCredentials', {
        lang: 'pt',
      });
      throw new UnauthorizedException(msg);
    }
  }

  async logout(refreshToken: string): Promise<void> {
    const payload = this.jwtService.verify(refreshToken);

    await this.refreshTokenRepository.delete({
      user: { id: payload.sub },
    });
  }
}
