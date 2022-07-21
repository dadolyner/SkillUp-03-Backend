import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import Fastify from 'fastify';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe, Logger } from '@nestjs/common';
import FirebaseConfig from './config/config.firebase';

const nextup = async () => {
    FirebaseConfig();
    
    const fastify = Fastify();
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(fastify), { cors: true });
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(3001, '0.0.0.0');
    Logger.log('Application is listening on port http://localhost:3001', 'NextUp');
}
nextup();
