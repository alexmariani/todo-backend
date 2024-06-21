import { ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { Exclude, Expose } from 'class-transformer';

export class UserDto {
  @ApiProperty({
    description: 'Id utente',
  })
  @Expose()
  public readonly id: number;

  @ApiProperty({
    description: 'Username utente',
  })
  @Expose()
  public readonly username: string;

  @ApiProperty({
    description: 'Password utente',
  })
  @Exclude()
  public readonly password: string;

  public async checkPassword(passwordToCompare: string): Promise<boolean> {
    return await bcrypt.compare(passwordToCompare, this.password);
  }

  public constructor(partial?: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}
