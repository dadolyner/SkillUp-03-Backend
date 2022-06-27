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
    async hashPassword(password: string, salt: string): Promise<string> { return await bcrypt.hash(password, salt) }

    //Delete sensitive data
    async deleteSensitiveData(keys: string[]): Promise<void> { keys.forEach(key => delete this[key]) }

    // Token generator for user
    async generateToken(lenght: number): Promise<string> {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let token = '';
        for (let i = 0; i < lenght; i++) token += chars[Math.floor(Math.random() * chars.length)];

        return token;
    }
}