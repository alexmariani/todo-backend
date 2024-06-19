import { ApiProperty } from '@nestjs/swagger';

export class TodoDto {
  @ApiProperty()
  public readonly id: number;
  @ApiProperty()
  public readonly title: string;
  @ApiProperty()
  public readonly completed: boolean;
  @ApiProperty()
  public readonly userId: number;

  public constructor(opts?: Partial<TodoDto>) {
    Object.assign(this, opts);
  }
}
