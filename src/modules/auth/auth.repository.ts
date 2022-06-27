// Auth Repository
import { getRepository } from "fireorm";
import { Users } from "src/entities/users.entity";
import * as bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { ConflictException, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { Logger } from "@nestjs/common";
import { AuthSignUpCredentialsDto } from "./dto/auth-credentials-signup.dto";
import { AuthLoginCredentialsDto } from "./dto/auth-credentials-login.dto";
import SendEmail from "src/mail/mail.config";
import { VerifyEmailTemplate } from "src/mail/mail.templates";

export class AuthRepository {
    private logger = new Logger('AuthRepository');
    constructor(public usersFirebase = getRepository(Users)) { }

    // Register user
    async register(registerParams: AuthSignUpCredentialsDto): Promise<void> {
        const { first_name, last_name, email, password } = registerParams;

        const user = new Users()
        user.id = uuid()
        user.first_name = first_name
        user.last_name = last_name
        user.email = email
        user.salt = await bcrypt.genSalt();
        user.password = await user.hashPassword(password, user.salt)
        user.token = await user.generateToken(64)
        user.tokenExpiaryDate = new Date(new Date().getTime() + 600000).toISOString();
        user.verified = false;

        const emailData = {
            to: email,
            from: 'skulj.david@gmail.com',
            subject: 'Verify your email',
            html: VerifyEmailTemplate(first_name, last_name, `${process.env.VERIFY_EMAIL}/${user.token}`),
        }

        const emailExists = await this.usersFirebase.whereEqualTo('email', email).find();
        if (emailExists.length > 0) {
            this.logger.error(`User with email: ${email} already exists`);
            throw new ConflictException('User with this email already exist!');
        } else {
            try {
                await SendEmail(emailData);
                await this.usersFirebase.create(user)
            }
            catch (error) {
                this.logger.error(error);
                throw new InternalServerErrorException()
            }
        }

        this.logger.verbose(`User with email: ${email} successfully registered! Awaiting mail confirmation.`);
    }

    // Verify user email
    async verifyUser(token: string): Promise<void> {
        try {
            const user = await this.usersFirebase.whereEqualTo('token', token).findOne();
            if (user) {
                user.verified = true;
                user.token = null;
                user.tokenExpiaryDate = null;
                await this.usersFirebase.update(user);

                this.logger.verbose(`User with email: ${user.email} has successfully verified its email!`);
            } else {
                this.logger.error(`User with token: ${token} does not exist!`);
                throw new UnauthorizedException('Invalid token');
            }
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException();
        }
    }

    // Validate login
    async validateLogin(loginParams: AuthLoginCredentialsDto): Promise<string> {
        const { email, password } = loginParams;
        const user = await this.usersFirebase.whereEqualTo('email', email).findOne();
        if (user && (await user.validatePassword(password))) return user.email;
        else return null;
    }
}