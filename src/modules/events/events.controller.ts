// Events Controller
import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Events } from 'src/entities/events.entoty';
import { Users } from 'src/entities/users.entity';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { CreateEventDTO } from './dto/create-event.dto';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
    constructor(private eventsService: EventsService) { }

    // Get all events
    @Get()
    async getAllEvents(): Promise<Events[]> {
        return this.eventsService.getAllEvents();
    }

    // Get event by id
    @Get('/:id')
    async getEventById(@Param('id') id: string): Promise<Events> {
        return this.eventsService.getEventById(id);
    }

    // Create event
    @UseGuards(AuthGuard())
    @Post()
    async createEvent(@Body() eventParams: CreateEventDTO, @GetUser() user: Users): Promise<Events> {
        return this.eventsService.createEvent(eventParams, user);
    }

    // Edit event
    @UseGuards(AuthGuard())
    @Patch('/edit/:id')
    async editEvent(@Param('id') eventId: string, @Body() eventParams: CreateEventDTO, @GetUser() user: Users): Promise<Events> {
        return this.eventsService.editEvent(eventId, eventParams, user);
    }

    // Delete event
    @UseGuards(AuthGuard())
    @Delete('/delete/:id')
    async deleteEvent(@Param('id') eventId: string, @GetUser() user: Users): Promise<Events> {
        return this.eventsService.deleteEvent(eventId, user);
    }
}
