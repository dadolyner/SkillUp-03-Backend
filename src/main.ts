import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import Fastify from 'fastify';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Logger } from '@nestjs/common';

const nextup = async () => {
    const fastify = Fastify();
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(fastify), { cors: true });
    await app.listen(3000);
    Logger.log('Application is listening on port 3000', 'NextUp');
}
nextup();
