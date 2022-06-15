// Users Repository
import { Logger } from "@nestjs/common";
import { getRepository } from "fireorm";
import { Attends } from "src/entities/attends.entity";
import { Events } from "src/entities/events.entoty";
import { Users } from "src/entities/users.entity";

export class UsersRepository {
    private logger = new Logger('UsersRepository');
    constructor(
        public usersFirebase = getRepository(Users),
        public eventsFirebase = getRepository(Events),
        public attendsFirebase = getRepository(Attends)
    ) { }

    // Get user info
    async getUserInfo(user: Users): Promise<any> {
        const { id, first_name, last_name } = user;

        try {
            const userInfo = await this.usersFirebase.whereEqualTo('id', id).findOne();
            const usersEvents = await this.eventsFirebase.whereEqualTo('userId', id).find();
            const usersAttends = await this.attendsFirebase.whereEqualTo('userId', id).find();

            const sensitiveData = ['password', 'salt', 'token', 'tokenExpiaryDate', 'verified']
            sensitiveData.forEach(key => delete userInfo[key]);

            const userInfoWithEvents = {
                userInfo,
                created_events: usersEvents,
                attended_events: usersAttends
            }

            this.logger.verbose(`User ${first_name} ${last_name} successfully retrieved its information!`)
            return userInfoWithEvents;
        } catch (error) {
            this.logger.error(error);
        }
    }
}