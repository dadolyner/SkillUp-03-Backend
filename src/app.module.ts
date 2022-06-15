import { AttendsModule } from './modules/attends/attends.module';
import { UsersModule } from './modules/users/users.module';
import { EventsModule } from './modules/events/events.module';
import { AuthModule } from './modules/auth/auth.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
        AttendsModule,
        UsersModule,
        AuthModule,
        EventsModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }
