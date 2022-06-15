// Attends Service
import { Injectable } from '@nestjs/common';
import { Attends } from 'src/entities/attends.entity';
import { Users } from 'src/entities/users.entity';
import { AttendsRepository } from './attends.repository';

@Injectable()
export class AttendsService {
    constructor(private attendsRepository: AttendsRepository) { }

    // Get all attends for user
    async getAttendsForUser(user: Users): Promise<Attends[]> {
        return await this.attendsRepository.getAttendsForUser(user);
    }

    // Get all attends for event
    async getAttendsForEvent(eventId: string): Promise<Attends[]> {
        return await this.attendsRepository.getAttendsForEvent(eventId);
    }

    // User is attending an event
    async attendEvent(user: Users, eventId: string): Promise<Attends> {
        return await this.attendsRepository.attendEvent(user, eventId);
    }
}
