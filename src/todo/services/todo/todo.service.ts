import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddTodoDto } from 'src/todo/dtos/add-todo.dto';
import { EditTodoDto } from 'src/todo/dtos/edit-todo.dto';
import { TodoDto } from 'src/todo/dtos/todo.dto';
import { Todo } from 'src/todo/entities';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { TodoMapperService } from '../todo-mapper/todo-mapper.service';

@Injectable()
export class TodoService {
  public constructor(
    @InjectRepository(Todo) private readonly todoRepository: Repository<Todo>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly todoMapper: TodoMapperService,
  ) {}

  public async findAll(): Promise<TodoDto[]> {
    const todos = await this.todoRepository.find();
    console.info(todos);
    const todosWithOwners = await Promise.all(
      todos.map(async (todo) => {
        const owner = await this.userRepository.findOne({
          where: { id: todo.user },
        });

        if (!owner) {
          throw new NotFoundException('Utente proprietario non trovato');
        }

        return this.todoMapper.modelToDto({ ...todo, user: owner.id });
      }),
    );

    return todosWithOwners;
  }

  public async findOne(id: number): Promise<TodoDto> {
    const todo = await this.todoRepository.findOne({ where: { id } });
    const owner = await this.userRepository.findOne({
      where: { id: todo.user },
    });

    if (!owner) {
      throw new NotFoundException('Utente proprietario non trovato');
    }

    if (todo == null || todo == undefined) throw new NotFoundException();
    return this.todoMapper.modelToDto({ ...todo, user: owner.id });
  }

  public async add({ title, userId }: AddTodoDto): Promise<TodoDto> {
    const owner = await this.userRepository.findOne({ where: { id: userId } });

    if (!owner) {
      throw new NotFoundException('Utente proprietario non trovato');
    }

    let todo = new Todo(title, owner.id);
    console.info(todo);
    todo = await this.todoRepository.save(todo);
    return this.todoMapper.modelToDto(todo);
  }

  public async edit(
    id: number,
    { title, completed }: EditTodoDto,
  ): Promise<TodoDto> {
    let todo = await this.todoRepository.findOne({ where: { id } });

    if (!todo) throw new NotFoundException('Todo non trovato');

    const owner = await this.userRepository.findOne({
      where: { id: todo.user },
    });

    if (!owner) {
      throw new NotFoundException(owner, 'Utente proprietario non trovato');
    }

    todo.completed = completed;
    todo.title = title;

    todo = await this.todoRepository.save(todo);

    return this.todoMapper.modelToDto({ ...todo, user: owner.id });
  }

  public async remove(id: number): Promise<TodoDto> {
    let todo = await this.todoRepository.findOne({ where: { id } });

    if (!todo) throw new NotFoundException('Todo non trovato');

    const owner = await this.userRepository.findOne({
      where: { id: todo.user },
    });

    if (!owner) {
      throw new NotFoundException(owner, 'Utente proprietario non trovato');
    }

    todo = await this.todoRepository.remove(todo);

    return this.todoMapper.modelToDto({ ...todo, user: owner.id });
  }
}
