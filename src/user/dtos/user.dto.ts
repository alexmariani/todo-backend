import { ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';

export class UserDto {
  @ApiProperty({
    description: 'Id utente',
  })
  public readonly id: number;

  @ApiProperty({
    description: 'Username utente',
  })
  public readonly username: string;

  @ApiProperty({
    description: 'Password utente',
  })
  public readonly password: string;

  public async checkPassword(passwordToCompare: string): Promise<boolean> {
    return await bcrypt.compare(passwordToCompare, this.password);
  }

  public constructor(opts?: Partial<UserDto>) {
    Object.assign(this, opts);
  }
}
