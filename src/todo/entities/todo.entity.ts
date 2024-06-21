import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { File } from './file.entity';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public title: string;

  @Column()
  public completed: boolean;

  @OneToOne(() => User, (user) => user.todo)
  public readonly user: User;

  @OneToMany(() => File, (file) => file.todo)
  public readonly files: Express.Multer.File[];

  public constructor(title: string, user: User, files: Express.Multer.File[]) {
    this.title = title;
    this.completed = false;
    this.user = user;
    this.files = files;
  }
}
