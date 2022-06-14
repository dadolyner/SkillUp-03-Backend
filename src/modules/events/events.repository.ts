// Events Repository
import { ConflictException, InternalServerErrorException, Logger } from "@nestjs/common";
import { getRepository } from "fireorm";
import { Events } from "src/entities/events.entoty";
import { Users } from "src/entities/users.entity";
import { CreateEventDTO } from "./dto/create-event.dto";
import { v4 as uuid } from "uuid";

export class EventsRepository {
    private logger = new Logger('EventsRepository');
    constructor(public eventsFirebase = getRepository(Events)) { }

    // Create event
    async createEvent(eventParams: CreateEventDTO, user: Users): Promise<Events> {
        const { event_name, location, date, max_users, description, image } = eventParams;
        const { id, first_name, last_name, email } = user;

        const event = new Events()
        event.id = uuid()
        event.event_name = event_name
        event.location = location
        event.date = new Date(date).toISOString()
        event.max_users = max_users
        event.description = description
        event.image = image
        event.userId = id

        const eventExists = await this.eventsFirebase
        .whereEqualTo('event_name', event_name)
        .whereEqualTo('location', location)
        .whereEqualTo('date', new Date(date).toISOString())
        .find()

        if(eventExists.length > 0) {
            this.logger.error(`User with email: ${email} tried to made an event but this event already exists!`);
            throw new ConflictException('Event like this already exists!');
        } else {
            try { this.eventsFirebase.create(event) }
            catch (error) {
                this.logger.error(`Internal server error: ${error}`);
                throw new InternalServerErrorException()
            }
        }
            
        this.logger.verbose(`User: ${first_name} ${last_name} successfully created an event named: ${event_name}!`);
        return event;
    }

    // Edit event
    async editEvent(eventId: string, eventParams: CreateEventDTO, user: Users): Promise<Events> {
        const { event_name, location, date, max_users, description, image } = eventParams;
        const { id, first_name, last_name } = user;

        const event = await this.eventsFirebase.whereEqualTo('id', eventId).whereEqualTo('userId', id).findOne();
        if (!event) {
            this.logger.error(`User ${first_name} ${last_name} does not have an event with id: ${eventId}!`);
            throw new InternalServerErrorException()
        }

        event.event_name = event_name
        event.location = location
        event.date = new Date(date).toISOString()
        event.max_users = max_users
        event.description = description
        event.image = image
        
        try { this.eventsFirebase.update(event) }
        catch (error) {
            this.logger.error(`There has been an error trying to update event: ${eventId}`);
            throw new InternalServerErrorException()
        }

        this.logger.verbose(`User ${first_name} ${last_name} successfully updated its event with id: ${eventId}!`);

        return event;
    }

    // Delete event
    async deleteEvent(eventId: string, user: Users): Promise<Events> {
        const { id, first_name, last_name } = user;
        const event = await this.eventsFirebase.whereEqualTo('id', eventId).whereEqualTo('userId', id).findOne();
        if (!event) { 
            this.logger.error(`User ${first_name} ${last_name} does not have an event with id: ${eventId}!`);
            throw new InternalServerErrorException() 
        }

        try { this.eventsFirebase.delete(event.id) }
        catch (error) {
            this.logger.error(`There has been an error trying to delete event: ${eventId}`);
            throw new InternalServerErrorException()
        }

        this.logger.verbose(`User ${first_name} ${last_name} successfully deleted its event with id: ${eventId}!`);

        return event;
    }
}