// Users Entity
import { Collection } from 'fireorm'
import * as bcrypt from 'bcrypt';

@Collection('users')
export class Users {
    id: string
    first_name: string
    last_name: string
    email: string
    password: string
    salt: string
    token: string
    tokenExpiaryDate: string
    verified: boolean

    // Validate user password with bcrypt
    async validatePassword(password: string): Promise<boolean> {
        const hash = await bcrypt.hash(password, this.salt);
        return hash === this.password;
    }

    // Hash password
    async hashPassword(password: string, salt: string) {
        return bcrypt.hash(password, salt);
    }
}