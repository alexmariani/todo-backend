import { Module } from '@nestjs/common';
import { Todo } from './entities/todo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoService } from './services/todo/todo.service';
import { TodoMapperService } from './services/todo-mapper/todo-mapper.service';
import { TodoController } from './controllers/todo/todo.controller';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Todo]), AuthModule, UserModule],
  providers: [TodoService, TodoMapperService],
  controllers: [TodoController],
})
export class TodoModule {}
