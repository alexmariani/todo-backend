import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostUserDto } from 'src/user/dtos/post-user.dto';
import { UserDto } from 'src/user/dtos/user.dto';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { UserMapperService } from '../user-mapper/user-mapper.service';

@Injectable()
export class UserService {
  public constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly userMapper: UserMapperService,
  ) {}

  public async findAll(): Promise<UserDto[]> {
    const users = await this.userRepository.find();
    return users.map(this.userMapper.modelToDto);
  }

  public async findOne(username: string): Promise<UserDto> {
    const user = await this.userRepository.findOne({
      where: { username },
    });
    if ([null, undefined].includes(user)) {
      return null;
    }
    return this.userMapper.modelToDto(user);
  }

  public async findOneById(id: number): Promise<UserDto> {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if ([null, undefined].includes(user)) {
      return null;
    }
    return this.userMapper.modelToDto(user);
  }

  public async add({ username, password }: PostUserDto): Promise<UserDto> {
    const user = new User(username, password);
    const addedUser = await this.userRepository.save(user);
    return this.userMapper.modelToDto(addedUser);
  }

  public async edit({ username, password }: PostUserDto): Promise<UserDto> {
    let user = await this.userRepository.findOne({
      where: {
        username,
      },
    });

    if (!user) throw new NotFoundException('Utente non trovato');

    user.username = username;
    user.password = password;

    user = await this.userRepository.save(user);

    return this.userMapper.modelToDto(user);
  }

  public async remove(id: number): Promise<User> {
    let user = await this.userRepository.findOne({ where: { id } });

    if (!user) throw new NotFoundException('Utente non trovato');

    user = await this.userRepository.remove(user);

    return user;
  }
}
