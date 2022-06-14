// Events Service
import { Injectable, Logger } from '@nestjs/common';
import { Events } from 'src/entities/events.entoty';
import { Users } from 'src/entities/users.entity';
import { CreateEventDTO } from './dto/create-event.dto';
import { EventsRepository } from './events.repository';

@Injectable()
export class EventsService {
    private logger = new Logger('AuthRepository');
    constructor(private eventsRepository: EventsRepository) { }

    // Create event
    async createEvent(eventParams: CreateEventDTO, user: Users): Promise<Events> {
        return this.eventsRepository.createEvent(eventParams, user);
    }
}
