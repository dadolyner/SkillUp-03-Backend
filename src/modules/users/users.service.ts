// Users Service
import { Injectable } from '@nestjs/common';
import { Users } from 'src/entities/users.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
    constructor(private usersRepository: UsersRepository) { }

    // Get user info
    async getUserInfo(user: Users): Promise<any> {
        return await this.usersRepository.getUserInfo(user);
    }
}
