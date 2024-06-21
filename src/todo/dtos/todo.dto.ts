import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from 'src/user/dtos';

export class TodoDto {
  @ApiProperty()
  public readonly id: number;
  @ApiProperty()
  public readonly title: string;
  @ApiProperty()
  public readonly completed: boolean;
  @ApiProperty()
  public readonly user: UserDto;
  @ApiProperty()
  public readonly files: Express.Multer.File[];

  public constructor(opts?: Partial<TodoDto>) {
    Object.assign(this, opts);
  }
}
