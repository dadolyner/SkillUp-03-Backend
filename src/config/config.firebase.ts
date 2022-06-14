import * as Firebase from 'firebase-admin';
import * as fireorm from 'fireorm';
import * as dotenv from 'dotenv';
import { Logger } from '@nestjs/common';
dotenv.config();

const FirebaseConfig = () => {
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
}

export default FirebaseConfig;