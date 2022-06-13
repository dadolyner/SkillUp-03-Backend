// Data Transfer Object for changing user info
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UsersEntityRegisterDto {
    @IsString()
    @IsNotEmpty()
    first_name: string;
    
    @IsString()
    @IsNotEmpty()
    last_name: string;
    
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
