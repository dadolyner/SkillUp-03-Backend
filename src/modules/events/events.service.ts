// Events Service
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Events } from 'src/entities/events.entoty';
import { Users } from 'src/entities/users.entity';
import { CreateEventDTO } from './dto/create-event.dto';
import { EventsRepository } from './events.repository';

@Injectable()
export class EventsService {
    private logger = new Logger('EventsService');
    constructor(private eventsRepository: EventsRepository) { }

    // Get all events
    async getAllEvents(): Promise<Events[]> {
        try {
            const events = await this.eventsRepository.eventsFirebase.find();
            if(!events) this.logger.error(`No events found!`);
            else this.logger.verbose(`Successfully retrieved all ${events.length} events!`);
            
            return events;
        } catch (error) {
            this.logger.error(`Failed to retrieve all events!`);
            throw new InternalServerErrorException(`Failed to retrieve all events: ${error}`);
        }
    }

    // Get event by id
    async getEventById(id: string): Promise<Events> {
        try {
            const event = await this.eventsRepository.eventsFirebase.whereEqualTo('id', id).findOne();
            if(!event) this.logger.error(`Event with id: ${id} does not exist!`);
            else this.logger.verbose(`Successfully retrieved details for event with id ${id}!`);

            return event;
        } catch (error) {
            this.logger.error(`Failed to retrieve details for event with id ${id}!`);
            throw new InternalServerErrorException(`Failed to retrieve details for event with id ${id}: ${error}`);
        }
    }

    // Create event
    async createEvent(eventParams: CreateEventDTO, user: Users): Promise<Events> {
        return this.eventsRepository.createEvent(eventParams, user);
    }

    // Edit event
    async editEvent(eventId: string, eventParams: CreateEventDTO, user: Users): Promise<Events> {
        return this.eventsRepository.editEvent(eventId, eventParams, user);
    }

    // Delete event
    async deleteEvent(eventId: string, user: Users): Promise<Events> {
        return this.eventsRepository.deleteEvent(eventId, user);
    }
}
