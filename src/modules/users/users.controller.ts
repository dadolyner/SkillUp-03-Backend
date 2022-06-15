// Users Controller
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Users } from 'src/entities/users.entity';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private userservice: UsersService) { }

    // Get user info
    @UseGuards(AuthGuard())
    @Get('/profile')
    async getUserInfo(@GetUser() user: Users): Promise<any> {
        return await this.userservice.getUserInfo(user);
    }
}
