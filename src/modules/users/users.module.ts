// Users Module
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UsersRepository } from './users.repository';

@Module({
    imports: [AuthModule],
    controllers: [UsersController],
    providers: [UsersRepository, UsersService],
})
export class UsersModule { }
