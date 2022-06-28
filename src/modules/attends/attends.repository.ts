// Attends Repository
import { InternalServerErrorException, Logger, UnauthorizedException } from "@nestjs/common";
import { getRepository } from "fireorm";
import { Attends } from "src/entities/attends.entity";
import { Events } from "src/entities/events.entity";
import { Users } from "src/entities/users.entity";
import { v4 as uuid } from "uuid";

export class AttendsRepository {
    private logger = new Logger('AttendsRepository');
    constructor(
        public usersFirebase = getRepository(Users),
        public eventsFirebase = getRepository(Events),
        public attendsFirebase = getRepository(Attends)
    ) { }

    // Get all attends for user
    async getAttendsForUser(user: Users): Promise<Attends[]> {
        try {
            const currentUser = await this.usersFirebase.whereEqualTo('id', user.id).findOne();
            if (!currentUser) {
                this.logger.error(`User not found`);
                throw new UnauthorizedException('User not found')
            }

            const attends = await this.attendsFirebase.whereEqualTo('userId', currentUser.id).find();
            this.logger.verbose(`All attends for user: ${user.first_name} ${user.last_name} successfully retrieved!`);

            return attends;
        } catch (error) {
            this.logger.error(error.message);
            throw new InternalServerErrorException(error)
        }
    }

    // Get all attends for event
    async getAttendsForEvent(eventId: string): Promise<Attends[]> {
        try {
            const currentEvent = await this.eventsFirebase.whereEqualTo('id', eventId).findOne();
            if (!currentEvent) {
                this.logger.error(`Event not found`);
                throw new UnauthorizedException('Event not found')
            }

            const attends = await this.attendsFirebase.whereEqualTo('eventId', currentEvent.id).find();
            this.logger.verbose(`All attends for event: ${currentEvent.event_name} successfully retrieved!`);

            return attends;
        } catch (error) {
            this.logger.error(error.message);
            throw new InternalServerErrorException(error)
        }
    }

    // User is attending an event
    async attendEvent(user: Users, eventId: string): Promise<Attends> {
        try {
            const currentUser = await this.usersFirebase.whereEqualTo('id', user.id).findOne();
            const currentEvent = await this.eventsFirebase.whereEqualTo('id', eventId).findOne();
            const attendExists = await this.attendsFirebase.whereEqualTo('userId', currentUser.id).whereEqualTo('eventId', currentEvent.id).findOne();

            if (!currentUser || !currentEvent) {
                this.logger.error(`User or event not found`);
                throw new UnauthorizedException('User or event not found')
            }
            if (attendExists) {
                this.logger.error(`User ${user.first_name} ${user.last_name} is already attending event with id: ${eventId}`);
                throw new UnauthorizedException('User already attending event')
            }

            const attends = new Attends();
            attends.id = uuid()
            attends.eventId = eventId;
            attends.userId = user.id;

            await this.attendsFirebase.create(attends);

            this.logger.verbose(`User ${user.first_name} ${user.last_name} successfully attended event with id: ${eventId}`);
            return attends;
        } catch (error) {
            this.logger.error(error.message);
            throw new InternalServerErrorException(error)
        }
    }

}