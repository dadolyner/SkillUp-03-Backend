import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import Fastify from 'fastify';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe, Logger } from '@nestjs/common';

import * as Firebase from 'firebase-admin';
import * as fireorm from 'fireorm';
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

        const firestore = Firebase.firestore();
        firestore.settings({ timestampsInSnapshots: true });
        fireorm.initialize(firestore);
        
    } catch (error) {
        Logger.error(`Application failed to connect to Firebase. Reason: ${error}`, 'Firebase');
    }

    const fastify = Fastify();
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(fastify), { cors: true });
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(3000, '0.0.0.0');
    Logger.log('Application is listening on port http://localhost:3000', 'NextUp');
}
nextup();
