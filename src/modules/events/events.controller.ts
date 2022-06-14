// Events Controller
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Events } from 'src/entities/events.entoty';
import { Users } from 'src/entities/users.entity';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { CreateEventDTO } from './dto/create-event.dto';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
    constructor(private eventsService: EventsService) { }

    // Create event
    @UseGuards(AuthGuard())
    @Post('/create')
    async createEvent(@Body() eventParams: CreateEventDTO, @GetUser() user: Users): Promise<Events> {
        return this.eventsService.createEvent(eventParams, user);
    }
}
