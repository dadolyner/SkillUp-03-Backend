// Attends Entity
import { Collection } from 'fireorm'

@Collection('attends')
export class Attends {
    id: string
    eventId: string
    userId: string
}