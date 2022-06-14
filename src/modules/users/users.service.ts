// Users Service
import { Injectable, Logger } from '@nestjs/common';
import { Users } from 'src/entities/users.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
    private logger = new Logger('UsersService');
    constructor(private usersRepository: UsersRepository) { }

    // Get user info
    async getUserInfo(user: Users): Promise<any> {
        const { id, first_name, last_name } = user;

        try {
            const userInfo = await this.usersRepository.usersFirebase.whereEqualTo('id', id).findOne();
            const usersEvents = await this.usersRepository.eventsFirebase.whereEqualTo('userId', id).find();

            const sensitiveData = ['password', 'salt', 'token', 'tokenExpiaryDate', 'verified']
            sensitiveData.forEach(key => delete userInfo[key]);

            const userInfoWithEvents = {
                userInfo,
                created_events: usersEvents
            }

            this.logger.verbose(`User ${first_name} ${last_name} successfully retrieved its information!`)
            return userInfoWithEvents;
        } catch (error) {
            this.logger.error(error);
        }
    }
}
