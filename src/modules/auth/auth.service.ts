import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { compare, hash } from 'bcryptjs';
import { User } from 'src/database/entities/user.entity';
import { RegisterDto } from './dto/regsiter.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseWrapperDto } from './dto/response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseWrapperDto> {
    const { email, password, name } = registerDto;

    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new UnauthorizedException('Email already in use');
    }

    const hashedPassword = await hash(password, 10);

    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      name,
    });

    await this.usersRepository.save(user);

    const token = this.generateToken(user);

    return {
      success: true,
      message: 'User registered successfully',
      data: {
        accessToken: token.accessToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseWrapperDto> {
    const { email, password } = loginDto;
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user || !(await compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user);

    return {
      success: true,
      message: 'User logged in successfully',
      data: {
        accessToken: token.accessToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
    };
  }

  private generateToken(user: User): { accessToken: string } {
    const payload = { email: user.email, sub: user.id, name: user.name };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
