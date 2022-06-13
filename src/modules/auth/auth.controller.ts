import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginCredentialsDto } from './dto/auth-credentials-login.dto';
import { AuthSignUpCredentialsDto } from './dto/auth-credentials-signup.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('/register')
    async register(@Body() registerParams: AuthSignUpCredentialsDto): Promise<void> {
        await this.authService.register(registerParams);
    }

    @Post('/login')
    async login(@Body() loginParams: AuthLoginCredentialsDto): Promise<{ accessToken: string }> {
        return await this.authService.login(loginParams);
    }
}
