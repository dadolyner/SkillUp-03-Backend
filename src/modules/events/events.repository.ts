// Events Repository
import { ConflictException, InternalServerErrorException, Logger } from "@nestjs/common";
import { getRepository } from "fireorm";
import { Events } from "src/entities/events.entoty";
import { Users } from "src/entities/users.entity";
import { CreateEventDTO } from "./dto/create-event.dto";
import { v4 as uuid } from "uuid";
import { CheckoutEventTemplate } from "src/mail/mail.templates";
import SendEmail from "src/mail/mail.config";

export class EventsRepository {
    private logger = new Logger('EventsRepository');
    constructor(
        public eventsFirebase = getRepository(Events),
        private usersFirebase = getRepository(Users)
    ) { }

    // Get all events
    async getAllEvents(): Promise<Events[]> {
        try {
            const events = await this.eventsFirebase.find();
            if (!events) this.logger.error(`No events found!`);
            else this.logger.verbose(`Successfully retrieved all ${events.length} events!`);

            return events;
        } catch (error) {
            this.logger.error(`Failed to retrieve all events!`);
            throw new InternalServerErrorException(`Failed to retrieve all events: ${error}`);
        }
    }

    // Get event by id
    async getEventById(eventId: string): Promise<Events> {
        try {
            const event = await this.eventsFirebase.whereEqualTo('id', eventId).findOne();
            if (!event) this.logger.error(`Event with id: ${eventId} does not exist!`);
            else this.logger.verbose(`Successfully retrieved details for event with id ${eventId}!`);

            return event;
        } catch (error) {
            this.logger.error(`Failed to retrieve details for event with id ${eventId}!`);
            throw new InternalServerErrorException(`Failed to retrieve details for event with id ${eventId}: ${error}`);
        }
    }

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

        const getAllUsers = await this.usersFirebase.find()
        const eventExists = await this.eventsFirebase
            .whereEqualTo('event_name', event_name)
            .whereEqualTo('location', location)
            .whereEqualTo('date', new Date(date).toISOString())
            .find()

        if (eventExists.length > 0) {
            this.logger.error(`User with email: ${email} tried to made an event but this event already exists!`);
            throw new ConflictException('Event like this already exists!');
        } else {
            try {
                await this.eventsFirebase.create(event)

                if (getAllUsers.length > 0) {
                    this.logger.verbose(`Opening connection to send mail to all users about event: ${event.id}!`);
                    getAllUsers.forEach(async user => {
                        const date = new Date(event.date).toLocaleDateString()
                        const time = new Date(event.date).toLocaleTimeString().substr(0, 5)
                        let emailData
                        if (user.email === email) {
                            emailData = {
                                to: user.email,
                                from: 'skulj.david@gmail.com',
                                subject: `You just created an event!`,
                                html: CheckoutEventTemplate(user.first_name, user.last_name, date, time, `${process.env.CHECKOUT_EVENT}/${event.id}`, true),
                            }
                        } else {
                            emailData = {
                                to: user.email,
                                from: 'skulj.david@gmail.com',
                                subject: `${first_name} ${last_name} just added a new event!`,
                                html: CheckoutEventTemplate(user.first_name, user.last_name, date, time, `${process.env.CHECKOUT_EVENT}/${event.id}`, false),
                            }
                        }
                        await SendEmail(emailData)
                        this.logger.verbose(`User: ${user.first_name} ${user.last_name} successfully recieved mail about this event!`);
                    })
                    this.logger.verbose(`Closing connection. Mail successfully sent to all users!`);
                }
            }
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