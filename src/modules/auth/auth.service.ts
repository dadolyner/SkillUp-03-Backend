// Auth Service
import { Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { AuthLoginCredentialsDto } from './dto/auth-credentials-login.dto';
import { AuthSignUpCredentialsDto } from './dto/auth-credentials-signup.dto';

@Injectable()
export class AuthService {
    constructor(private authRepository: AuthRepository) { }

    // Register user
    async register(registerParams: AuthSignUpCredentialsDto): Promise<void> {
        return await this.authRepository.register(registerParams);
    }

    // Login user and get accessToken
    async login(loginParams: AuthLoginCredentialsDto): Promise<{ accessToken: string }> {
        return await this.authRepository.login(loginParams);
    }
}
