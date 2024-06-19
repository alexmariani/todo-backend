import { User } from 'src/user/entities/user.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public title: string;

  @Column()
  public completed: boolean;

  @OneToOne(() => User, (user) => user.todo)
  public readonly user: number;

  public constructor(title: string, user: number) {
    this.title = title;
    this.completed = false;
    this.user = user;
  }
}
