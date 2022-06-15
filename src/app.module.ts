import { AttendsModule } from './modules/attends/attends.module';
import { UsersModule } from './modules/users/users.module';
import { EventsModule } from './modules/events/events.module';
import { AuthModule } from './modules/auth/auth.module';
import { Module } from '@nestjs/common';

@Module({
    imports: [
        AttendsModule,
        UsersModule,
        AuthModule,
        EventsModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }
