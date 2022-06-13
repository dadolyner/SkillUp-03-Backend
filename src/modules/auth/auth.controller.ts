import { Body, Controller, Post } from '@nestjs/common';
import { UsersEntityRegisterDto } from 'src/entities/dto/users.entity.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('/register')
    async register(@Body() registerParams: UsersEntityRegisterDto): Promise<void> {
        await this.authService.register(registerParams);
    }
}
