// Users Repository
import { Logger } from "@nestjs/common";
import { getRepository } from "fireorm";
import { Events } from "src/entities/events.entoty";
import { Users } from "src/entities/users.entity";

export class UsersRepository {
    private logger = new Logger('UsersRepository');
    constructor(
        public usersFirebase = getRepository(Users),
        public eventsFirebase = getRepository(Events)
    ) { }

}