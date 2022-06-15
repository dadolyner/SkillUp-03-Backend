// Auth Service
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './auth.repository';
import { AuthLoginCredentialsDto } from './dto/auth-credentials-login.dto';
import { AuthSignUpCredentialsDto } from './dto/auth-credentials-signup.dto';
import { JwtPayload } from './jwt/jwt-payload.interface';

@Injectable()
export class AuthService {
    private logger = new Logger('AuthService');
    constructor(private authRepository: AuthRepository,
        private jwtService: JwtService,) { }

    // Register user
    async register(registerParams: AuthSignUpCredentialsDto): Promise<void> {
        return await this.authRepository.register(registerParams);
    }

    // Verify user email
    async verifyUser(token: string): Promise<void> {
        return await this.authRepository.verifyUser(token);
    }

    // Login user and get accessToken
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
            this.logger.error(error);
            throw new UnauthorizedException('Invalid credentials');
        }
    }
}
