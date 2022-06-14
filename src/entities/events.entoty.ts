import { Collection } from 'fireorm'

@Collection('events')
export class Events {
    id: string
    event_name: string
    location: string
    date: string
    max_users: number
    description: string
    image: string
    userId: string
}