import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Todo } from '.';

@Entity()
export class File {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public fileName: string;

  @ManyToOne(() => Todo, (todo) => todo.files)
  public todo: Todo;

  public constructor(fileName: string, todo: Todo) {
    this.todo = todo;
    this.fileName = fileName;
  }
}
