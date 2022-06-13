// Data Transfer Object for signing up
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class AuthSignUpCredentialsDto {
    @IsString()
    @MinLength(2, { message: 'First name is too short!' })
    first_name: string;

    @IsString()
    @MinLength(2, { message: 'Last name is too short!' })
    last_name: string;

    @IsEmail({ message: 'This is not an email!' })
    email: string;

    @IsString()
    @MinLength(8, { message: 'Password is too short!' })
    @MaxLength(100, { message: 'Password is too long!' })
    password: string;
}
