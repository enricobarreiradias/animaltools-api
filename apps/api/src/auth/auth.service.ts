
import { 
  Injectable, 
  UnauthorizedException, 
  ConflictException, 
  InternalServerErrorException, 
  NotFoundException, 
  ForbiddenException,
  Logger 
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as config from 'config'; // A lib config

import { AuthCredentialsDto } from './auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';
import { AuditService } from '../audit/audit.service';

import { User } from '@lib/data/entities/user.entity';
import { UserRole } from '@lib/data/enums/user-role.enum'; 

// 1. Interface profissional para erros do Driver Postgres
interface PostgresError extends Error {
  code: string; // O código do erro é garantido como string
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  
  // Variável tipada corretamente (pode ser string ou null)
  private readonly ADMIN_EMAIL: string | null;

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private auditService: AuditService,
  ) {
    // 2. Leitura segura da configuração
    // Usamos o método .get<string> para dizer ao TS que esperamos uma string
    const configPath = 'security.superAdminEmail';
    if (config.has(configPath)) {
        this.ADMIN_EMAIL = config.get<string>(configPath);
    } else {
        this.ADMIN_EMAIL = null;
    }

    if (!this.ADMIN_EMAIL) {
        this.logger.warn('SEGURANÇA: SUPER_ADMIN_EMAIL não está configurado!');
    } else {
        this.logger.log(`Segurança: Proteção ativa para: ${this.ADMIN_EMAIL}`);
    }
  }

  // --- MÉTODOS ---

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { email, password, fullName } = authCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      fullName: fullName || 'Novo Usuário',
      role: UserRole.USER, 
    });

    try {
      await this.userRepository.save(user);
    } catch (error: unknown) {
      // 3. Type Guard Profissional
      // Verificamos se o erro é um objeto e tem a propriedade 'code'
      if (this.isPostgresError(error) && error.code === '23505') {
        throw new ConflictException('Este email já está cadastrado.');
      } else {
        this.logger.error('Erro ao salvar usuário:', error);
        throw new InternalServerErrorException();
      }
    }
  }

  // Helper para verificar se é um erro do Postgres (Type Guard)
  private isPostgresError(error: unknown): error is PostgresError {
      return (
          typeof error === 'object' &&
          error !== null &&
          'code' in error
      );
  }

  async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<User | null> {
    const { email, password } = authCredentialsDto;
    const user = await this.userRepository.findOne({ 
        where: { email },
        select: ['id', 'email', 'password', 'role', 'fullName'] 
    });

    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string, user: any }> {
    const user = await this.validateUserPassword(authCredentialsDto); 

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload: JwtPayload = { 
        email: user.email,
        sub: user.id,   
        role: user.role 
    }; 
    
    const accessToken = this.jwtService.sign(payload);

    return { 
        accessToken,
        user: { 
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            role: user.role
        }
    };
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      select: ['id', 'fullName', 'email', 'role', 'registrationDate'], 
      order: { fullName: 'ASC' }
    });
  }

  async update(id: number, updateData: { fullName?: string; email?: string; password?: string; role?: UserRole }): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
        throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
    }

    if (this.ADMIN_EMAIL && user.email === this.ADMIN_EMAIL) {
        throw new ForbiddenException('Não é permitido alterar o Super Admin.');
    }

    const { fullName, email, password, role } = updateData;

    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (role) user.role = role;

    if (password) {
        const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(password, salt);
    }

    try {
        await this.userRepository.save(user);
    } catch (error: unknown) {
        if (this.isPostgresError(error) && error.code === '23505') {
            throw new ConflictException('Email já está em uso.');
        } else {
            throw new InternalServerErrorException();
        }
    }
  }

  async remove(id: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
        throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
    }

    if (this.ADMIN_EMAIL && user.email === this.ADMIN_EMAIL) {
        throw new ForbiddenException('Não é permitido remover o Super Admin.');
    }

    await this.userRepository.remove(user);
  }
}