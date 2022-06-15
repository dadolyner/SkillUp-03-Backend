// Data transfer object for sending email
import { IsEmail, IsString } from 'class-validator';

export class EmailParamsDto {
    @IsString()
    first_name: string;

    @IsString()
    last_name: string;
    
    @IsEmail({ message: 'This is not an email!' })
    email: string;

    @IsString()
    token: string
}
