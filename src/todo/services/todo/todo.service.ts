import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddTodoDto } from 'src/todo/dtos/add-todo.dto';
import { EditTodoDto } from 'src/todo/dtos/edit-todo.dto';
import { TodoDto } from 'src/todo/dtos/todo.dto';
import { Todo } from 'src/todo/entities';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { TodoMapperService } from '../todo-mapper/todo-mapper.service';
import { File } from 'src/todo/entities/file.entity';
import { FileUploadDto } from 'src/todo/dtos/file-upload.dto';
import { unlink } from 'fs';
import * as path from 'path';

@Injectable()
export class TodoService {
  public constructor(
    @InjectRepository(Todo) private readonly todoRepository: Repository<Todo>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(File) private readonly fileRepositoty: Repository<File>,
    private readonly todoMapper: TodoMapperService,
  ) {}

  public async findAll(): Promise<TodoDto[]> {
    const todos = await this.todoRepository.find({
      relations: ['files', 'user'],
    });
    return todos.map(this.todoMapper.modelToDto);
  }

  public async findOne(id: number): Promise<TodoDto> {
    const todo = await this.todoRepository.findOne({
      where: { id },
      relations: ['files', 'user'],
    });

    if (!todo) throw new NotFoundException('Todo non trovato');
    return this.todoMapper.modelToDto(todo);
  }

  public async add({ title, userId }: AddTodoDto): Promise<TodoDto> {
    const owner = await this.userRepository.findOne({ where: { id: userId } });

    if (!owner) {
      throw new NotFoundException('Utente proprietario non trovato');
    }

    let todo = new Todo(title, owner, []);
    todo = await this.todoRepository.save(todo);
    return this.todoMapper.modelToDto(todo);
  }

  public async edit(
    id: number,
    { title, completed }: EditTodoDto,
  ): Promise<TodoDto> {
    let todo = await this.todoRepository.findOne({
      where: { id },
      relations: ['user', 'files'],
    });

    if (!todo) throw new NotFoundException('Todo non trovato');

    todo.completed = completed;
    todo.title = title;

    todo = await this.todoRepository.save(todo);

    return this.todoMapper.modelToDto(todo);
  }

  public async remove(id: number): Promise<TodoDto> {
    let todo = await this.todoRepository.findOne({
      where: { id },
      relations: ['user', 'files'],
    });

    if (!todo) throw new NotFoundException('Todo non trovato');

    todo = await this.todoRepository.remove(todo);

    return this.todoMapper.modelToDto(todo);
  }

  public async addFiles(id: number, files: FileUploadDto): Promise<File[]> {
    const todo = await this.todoRepository.findOne({
      where: { id },
      relations: ['files'],
    });

    const { files: filesToShow } = files;

    const returnedFiles = Promise.all(
      filesToShow.map(async (file) => {
        const createdFile = new File(file.filename, todo);
        await this.fileRepositoty.insert(createdFile);
        return createdFile;
      }),
    );
    return returnedFiles;
  }

  public async findFile(idFile: number): Promise<File> {
    const file = await this.fileRepositoty.findOne({
      where: { id: idFile },
    });
    if (!file) throw new NotFoundException('Il file non è stato trovato');
    return file;
  }

  public async deleteFile(idFile: number): Promise<void> {
    const file = await this.fileRepositoty.findOne({ where: { id: idFile } });
    const filePath = path.join(process.cwd(), 'uploads', file.fileName);
    if (!file) throw new NotFoundException('File non esistente');
    unlink(filePath, async (err) => {
      if (err) {
        console.error('File non trovato');
        return;
      }
      await this.fileRepositoty.delete({ id: idFile });
    });
  }
}
