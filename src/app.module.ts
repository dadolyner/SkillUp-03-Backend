import { EventsModule } from './modules/events/events.module';
import { AuthModule } from './modules/auth/auth.module';
import { Module } from '@nestjs/common';

@Module({
    imports: [
        AuthModule,
        EventsModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }
