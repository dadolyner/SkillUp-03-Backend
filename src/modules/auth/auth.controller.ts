// Auth Controller
import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginCredentialsDto } from './dto/auth-credentials-login.dto';
import { AuthSignUpCredentialsDto } from './dto/auth-credentials-signup.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('/register')
    async register(@Body() registerParams: AuthSignUpCredentialsDto): Promise<void> {
        return await this.authService.register(registerParams);
    }

    @Patch('/verify-email/:token')
    async verifyUser(@Param('token') token: string): Promise<void> {
        return await this.authService.verifyUser(token);
    }

    @Post('/login')
    async login(@Body() loginParams: AuthLoginCredentialsDto): Promise<{ accessToken: string }> {
        return await this.authService.login(loginParams);
    }
}
