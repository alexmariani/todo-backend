import { Injectable } from '@nestjs/common';
import { UserDto } from 'src/user/dtos/user.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class UserMapperService {
    public modelToDto({ id, password, username }: User): UserDto {
        return new UserDto({ id, username, password });
    }
}
