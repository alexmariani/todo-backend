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
  private jwtOptions: { secret: string; verify: { algorithms: string[] } };

  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {
    this.jwtOptions = {
      secret: 'secretKey',

      verify: { algorithms: ['HS256'] },
    };
  }

  async signIn(loginUser: PostUserDto): Promise<{ access_token: string }> {
    const user = await this.userService.findOne(loginUser.username);
    console.info(user);
    if (!user || !(await user.checkPassword(loginUser.password))) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(registerUser: PostUserDto): Promise<{ access_token: string }> {
    let user = await this.userService.findOne(registerUser.username);
    console.info(user);
    if (user != null || user != undefined) {
      throw new ConflictException();
    }

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
