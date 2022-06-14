// Auth Service
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { AuthLoginCredentialsDto } from './dto/auth-credentials-login.dto';
import { AuthSignUpCredentialsDto } from './dto/auth-credentials-signup.dto';
import { JwtPayload } from './jwt/jwt-payload.interface';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    private logger = new Logger('AuthRepository');
    constructor(
        private authRepository: AuthRepository,
        private jwtService: JwtService,
    ) { }

    // Register Request
    async register(registerParams: AuthSignUpCredentialsDto): Promise<void> {
        await this.authRepository.register(registerParams);
    }

    // Login Request
    async login(loginParams: AuthLoginCredentialsDto): Promise<{ accessToken: string }> {
        const { email, password } = loginParams;
        const doesEmailExist = await this.authRepository.usersFirebase.whereEqualTo('email', email).findOne();
        const isUserValidated = await this.authRepository.validateLogin({ email, password });

        try {
            if (!isUserValidated) {
                if (!doesEmailExist) {
                    this.logger.error(`User with email: ${email} does not exist!`);
                    throw new UnauthorizedException('Email not exists')
                }

                this.logger.error(`User tried to login but has entered Invalid credentials`);
                throw new UnauthorizedException('Invalid credentials')
            }

            if (!doesEmailExist.verified) {
                this.logger.error(`User with email: ${email} has not verified their email!`);
                throw new UnauthorizedException('Email not verified')
            }

            const payload: JwtPayload = { email };
            const accessToken = this.jwtService.sign(payload);

            this.logger.verbose(`User with email: ${email} logged in!`);

            return { accessToken };

        } catch (error) {
            throw new UnauthorizedException('Invalid credentials');
        }
    }
}
