

import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AddTodoDto } from 'src/todo/dtos/add-todo.dto';
import { EditTodoDto } from 'src/todo/dtos/edit-todo.dto';
import { TodoDto } from 'src/todo/dtos/todo.dto';
import { TodoService } from 'src/todo/services/todo/todo.service';


@Controller('todos')
@ApiTags('Todo')
@ApiBearerAuth()
export class TodoController {

    public constructor(private readonly todoService: TodoService) { }

    @Get()
    @ApiOperation({ summary: 'Restituisce tutti i todo' })
    @ApiResponse({ status: 200, description: 'Lista dei todo trovati' })
    @ApiResponse({ status: 400, description: "Richiesta mal formata" })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 404, description: 'Non trovato' })
    @ApiResponse({ status: 500, description: 'Errore non previsto' })
    public findAll(): Promise<TodoDto[]> {
        return this.todoService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Restituisce un todo' })
    @ApiResponse({ status: 200, description: 'Todo trovato' })
    @ApiResponse({ status: 400, description: "Richiesta mal formata" })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 404, description: 'Non trovato' })
    @ApiResponse({ status: 500, description: 'Errore non previsto' })
    public findOne(@Param('id') id: number): Promise<TodoDto> {
        return this.todoService.findOne(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Modifica un todo ' })
    @ApiResponse({ status: 204, description: 'Todo modificato con successo' })
    @ApiResponse({ status: 400, description: "Richiesta mal formata" })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 404, description: 'Non trovato' })
    @ApiResponse({ status: 500, description: 'Errore non previsto' })
    public edit(@Param('id') id: number, @Body() todo: EditTodoDto): Promise<TodoDto> {
        return this.todoService.edit(id, todo);
    }

    @Post()
    @ApiOperation({ summary: 'Inserisce un todo' })
    @ApiResponse({ status: 201, description: 'Todo aggiunto con successo' })
    @ApiResponse({ status: 400, description: "Richiesta mal formata" })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 404, description: 'Non trovato' })
    @ApiResponse({ status: 500, description: 'Errore non previsto' })
    public add(@Body() todo: AddTodoDto): Promise<TodoDto> {
        return this.todoService.add(todo);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Elimina un todo' })
    @ApiResponse({ status: 200, description: 'Todo rimosso con successo' })
    @ApiResponse({ status: 400, description: "Richiesta mal formata" })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 404, description: 'Non trovato' })
    @ApiResponse({ status: 500, description: 'Errore non previsto' })
    public remove(@Param('id') id: number): Promise<TodoDto> {
        return this.todoService.remove(id);
    }

}