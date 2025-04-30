// File: src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';  // Import JwtService
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,  // Inject JwtService
  ) {}

  // Register user as a provider or seeker
  async register(registerDto: RegisterDto): Promise<any> {
    const { email, password, name, role } = registerDto;

    // Check if the user already exists
    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the user
    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      fullName: name,  // Correct the 'name' field to 'fullName' if needed
      role,            // Set the user's role
    });

    await this.usersRepository.save(user);

    return {
      status: true,
      message: `User registered as ${role} successfully`,
      data: user,
    };
  }

  // Login method to authenticate user and return JWT token
  async login(loginDto: LoginDto): Promise<any> {
    const { email, password } = loginDto;

    // Check if user exists
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate JWT token
    const payload = { userId: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    return {
      status: true,
      message: 'Login successful',
      data: { token, payload },
    };
  }
}
