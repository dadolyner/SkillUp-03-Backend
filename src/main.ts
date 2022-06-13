import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import Fastify from 'fastify';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Logger } from '@nestjs/common';

import * as Firebase from 'firebase-admin';
import * as dotenv from 'dotenv';
dotenv.config();

const nextup = async () => {
    try {
        Firebase.initializeApp({
            credential: Firebase.credential.cert({
                privateKey: process.env.FIREBASE_PRIVATE_KEY,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                projectId: process.env.FIREBASE_PROJECT_ID,
            } as Partial<Firebase.ServiceAccount> ),
            databaseURL: process.env.FIREBASE_DATABASE_URL,
        })
        Logger.log('Application is successfully connected to Firebase', 'Firebase');
    } catch (error) {
        Logger.error(error);
    }

    const fastify = Fastify();
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(fastify), { cors: true });
    await app.listen(3000);
    Logger.log('Application is listening on port http://localhost:3000', 'NextUp');
}
nextup();
