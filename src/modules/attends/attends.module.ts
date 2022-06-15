// Attends Module
import { AttendsService } from './attends.service';
import { AttendsController } from './attends.controller';
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AttendsRepository } from './attends.repository';

@Module({
    imports: [AuthModule],
    controllers: [AttendsController],
    providers: [AttendsRepository, AttendsService],
})
export class AttendsModule { }
