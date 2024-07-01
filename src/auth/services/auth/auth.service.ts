import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PostUserDto } from 'src/user/dtos/post-user.dto';
import { UserService } from 'src/user/services/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async signIn(loginUser: PostUserDto): Promise<{ access_token: string }> {
    const user = await this.userService.findOne(loginUser.username);
    if (!user || !(await user.checkPassword(loginUser.password))) {
      throw new UnauthorizedException(
        'Utente non censito o credenziali non corrette',
      );
    }
    const payload = { sub: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(registerUser: PostUserDto): Promise<{ access_token: string }> {
    let user = await this.userService.findOne(registerUser.username);
    if (!user) throw new ConflictException('Utente già presente nel sistema');
    user = await this.userService.add(registerUser);
    const payload = { sub: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  validate(payload) {
    return { userId: payload.sub, username: payload.username };
  }
}
