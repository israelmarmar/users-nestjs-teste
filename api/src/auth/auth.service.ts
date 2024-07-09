import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { randomBytes } from 'crypto';
import { EmailService } from 'src/email/email.service';
import * as dotenv from 'dotenv';
import { ChangePasswordDto } from './dto/change-password.dto';
dotenv.config();

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(email: string, password: string): Promise<string> {
    const isValidUser = await this.validateUser(email, password);

    if (!isValidUser) {
      throw new Error('Invalid credentials');
    }

    const payload = { id: isValidUser._id, email };
    return this.jwtService.sign(payload);
  }

  async register(createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  async sendRecoverPasswordEmail(email: string): Promise<void> {
    const user = await this.usersService.findByEmail(email);

    if (!user)
      throw new NotFoundException('Não há usuário cadastrado com esse email.');

    const recoverToken: string = randomBytes(32).toString('hex');
    this.usersService.update(user._id, { recoverToken });

    await this.emailService.sendMail(
      user.email,
      'recuperação de senha',
      `link de recuperação ${process.env.WEB_URL}/reset?token=${recoverToken}`,
    );
  }

  async changePassword(
    id: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const { password, passwordConfirmation } = changePasswordDto;

    if (password != passwordConfirmation)
      throw new UnprocessableEntityException('As senhas não conferem');

    await this.usersService.changePassword(id, password);
  }

  async resetPassword(
    recoverToken: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const user = await this.usersService.findByRecoverToken(recoverToken);
    if (!user) throw new NotFoundException('Token inválido.');

    try {
      await this.changePassword(user._id, changePasswordDto);
    } catch (error) {
      throw error;
    }
  }
}
