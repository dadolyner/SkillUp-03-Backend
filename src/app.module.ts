import { AuthModule } from './modules/auth/auth.module';
import { Module } from '@nestjs/common';

@Module({
    imports: [AuthModule],
    controllers: [],
    providers: [],
})
export class AppModule { }
