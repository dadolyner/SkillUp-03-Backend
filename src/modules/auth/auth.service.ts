import { Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { UsersEntityRegisterDto } from 'src/entities/dto/users.entity.dto';

@Injectable()
export class AuthService {
    constructor(private authRepository: AuthRepository) { }

    async register(registerParams: UsersEntityRegisterDto): Promise<void> {
        await this.authRepository.register(registerParams);
    }
}
