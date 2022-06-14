// Data Transfer Object for creating an event
import { IsNumber, IsString, MinLength } from 'class-validator';

export class CreateEventDTO {
    @IsString({ message: 'Name is required' })
    event_name: string
    
    @IsString({ message: 'Location is required' })
    @MinLength(10, { message: 'This is not a valid location' })
    location: string

    @IsString({ message: 'Date is required' })
    date: string

    @IsNumber()
    max_users: number

    @IsString({ message: 'Description is required' })
    description: string

    @IsString({ message: 'Image is required' })
    image: string
}
