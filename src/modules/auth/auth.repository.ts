// Auth Repository
import { getRepository } from "fireorm";
import { Users } from "src/entities/users.entity";
import * as bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { ConflictException, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { Logger } from "@nestjs/common";
import { AuthSignUpCredentialsDto } from "./dto/auth-credentials-signup.dto";
import { AuthLoginCredentialsDto } from "./dto/auth-credentials-login.dto";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "./jwt/jwt-payload.interface";

export class AuthRepository {
    private logger = new Logger('AuthRepository');
    constructor(
        public usersFirebase = getRepository(Users),
        private jwtService: JwtService
    ) { }

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
        user.token = null
        user.tokenExpiaryDate = null
        user.verified = false

        const emailExists = await this.usersFirebase.whereEqualTo('email', email).find();
        if (emailExists.length > 0) {
            this.logger.error(`User with email: ${email} already exists`);
            throw new ConflictException('User with this email already exist!');
        } else {
            try { this.usersFirebase.create(user) }
            catch (error) {
                this.logger.error(`Internal server error: ${error}`);
                throw new InternalServerErrorException()
            }
        }

        this.logger.verbose(`User with email: ${email} successfully registered!`);
    }

    // Login user
    async login(loginParams: AuthLoginCredentialsDto): Promise<{ accessToken: string }> {
        const { email, password } = loginParams;
        const doesEmailExist = await this.usersFirebase.whereEqualTo('email', email).findOne();
        const isUserValidated = await this.validateLogin({ email, password });

        try {
            if (!isUserValidated) {
                if (!doesEmailExist) {
                    this.logger.error(`User with email: ${email} does not exist!`);
                    throw new UnauthorizedException('Email not exists')
                }

                this.logger.error(`User tried to login but has entered Invalid credentials`);
                throw new UnauthorizedException('Invalid credentials')
            }

            if (!doesEmailExist.verified) {
                this.logger.error(`User with email: ${email} has not verified their email!`);
                throw new UnauthorizedException('Email not verified')
            }

            const payload: JwtPayload = { email };
            const accessToken = this.jwtService.sign(payload);

            this.logger.verbose(`User with email: ${email} logged in!`);

            return { accessToken };

        } catch (error) {
            throw new UnauthorizedException('Invalid credentials');
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