import { Injectable } from '@nestjs/common';
import { TodoDto } from 'src/todo/dtos/todo.dto';
import { Todo } from 'src/todo/entities';
import { UserDto } from '../../../user/dtos/user.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class TodoMapperService {
  public modelToDto({ id, title, completed, user, files }: Todo): TodoDto {
    return plainToInstance(
      TodoDto,
      new TodoDto({
        id,
        title,
        completed,
        files,
        user: plainToInstance(UserDto, new UserDto({ ...user })),
      }),
    );
  }
}
