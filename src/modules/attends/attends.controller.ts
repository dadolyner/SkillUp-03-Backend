// Attends Controller
import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Attends } from 'src/entities/attends.entity';
import { Users } from 'src/entities/users.entity';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { AttendsService } from './attends.service';

@Controller('attends')
export class AttendsController {
    constructor(private attendsService: AttendsService) { }

    // Get all attends for user
    @UseGuards(AuthGuard())
    @Get()
    async getAttendsForUser(@GetUser() user: Users): Promise<Attends[]> {
        return await this.attendsService.getAttendsForUser(user);
    }

    // Get all attends for event
    @Get('/:id')
    async getAttendsForEvent(@Param('id') eventId: string): Promise<Attends[]> {
        return await this.attendsService.getAttendsForEvent(eventId);
    }

    // User is attending an event
    @UseGuards(AuthGuard())
    @Post('/:id')
    async attendEvent(@GetUser() user: Users, @Param('id') eventId: string): Promise<Attends> {
        return await this.attendsService.attendEvent(user, eventId);
    }
}
