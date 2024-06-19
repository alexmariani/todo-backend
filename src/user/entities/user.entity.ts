import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Todo } from 'src/todo/entities';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public username: string;

  @Column()
  public password: string;

  @OneToOne(() => Todo, (todo) => todo.user)
  @JoinColumn()
  todo: Todo;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  public constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }
}
