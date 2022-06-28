// Events Service
import { Injectable } from '@nestjs/common';
import { Events } from 'src/entities/events.entity';
import { Users } from 'src/entities/users.entity';
import { CreateEventDTO } from './dto/create-event.dto';
import { EventsRepository } from './events.repository';

@Injectable()
export class EventsService {
    constructor(private eventsRepository: EventsRepository) { }

    // Get all events
    async getAllEvents(): Promise<Events[]> {
        return await this.eventsRepository.getAllEvents();
    }

    // Get event by id
    async getEventById(eventId: string): Promise<Events> {
        return await this.eventsRepository.getEventById(eventId);
    }

    // Create event
    async createEvent(eventParams: CreateEventDTO, user: Users): Promise<Events> {
        return await this.eventsRepository.createEvent(eventParams, user);
    }

    // Edit event
    async editEvent(eventId: string, eventParams: CreateEventDTO, user: Users): Promise<Events> {
        return await this.eventsRepository.editEvent(eventId, eventParams, user);
    }

    // Delete event
    async deleteEvent(eventId: string, user: Users): Promise<Events> {
        return await this.eventsRepository.deleteEvent(eventId, user);
    }
}
