import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { AddTodoDto } from 'src/todo/dtos/add-todo.dto';
import { EditTodoDto } from 'src/todo/dtos/edit-todo.dto';
import { FileUploadDto } from 'src/todo/dtos/file-upload.dto';
import { TodoDto } from 'src/todo/dtos/todo.dto';
import { TodoService } from 'src/todo/services/todo/todo.service';

@Controller('todos')
@ApiTags('Todo')
@ApiBearerAuth()
export class TodoController {
  public constructor(private readonly todoService: TodoService) {}

  @Get()
  @ApiOperation({ summary: 'Restituisce tutti i todo' })
  @ApiResponse({ status: 200, description: 'Lista dei todo trovati' })
  @ApiResponse({ status: 400, description: 'Richiesta mal formata' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Non trovato' })
  @ApiResponse({ status: 500, description: 'Errore non previsto' })
  public findAll(): Promise<TodoDto[]> {
    return this.todoService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Restituisce un todo' })
  @ApiResponse({ status: 200, description: 'Todo trovato' })
  @ApiResponse({ status: 400, description: 'Richiesta mal formata' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Non trovato' })
  @ApiResponse({ status: 500, description: 'Errore non previsto' })
  public findOne(@Param('id') id: number): Promise<TodoDto> {
    return this.todoService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modifica un todo ' })
  @ApiResponse({ status: 204, description: 'Todo modificato con successo' })
  @ApiResponse({ status: 400, description: 'Richiesta mal formata' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Non trovato' })
  @ApiResponse({ status: 500, description: 'Errore non previsto' })
  public edit(
    @Param('id') id: number,
    @Body() todo: EditTodoDto,
  ): Promise<TodoDto> {
    return this.todoService.edit(id, todo);
  }

  @Post()
  @ApiOperation({ summary: 'Inserisce un todo' })
  @ApiResponse({ status: 201, description: 'Todo aggiunto con successo' })
  @ApiResponse({ status: 400, description: 'Richiesta mal formata' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Non trovato' })
  @ApiResponse({ status: 500, description: 'Errore non previsto' })
  public add(@Body() todo: AddTodoDto): Promise<TodoDto> {
    return this.todoService.add(todo);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Elimina un todo' })
  @ApiResponse({ status: 200, description: 'Todo rimosso con successo' })
  @ApiResponse({ status: 400, description: 'Richiesta mal formata' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Non trovato' })
  @ApiResponse({ status: 500, description: 'Errore non previsto' })
  public remove(@Param('id') id: number): Promise<TodoDto> {
    return this.todoService.remove(id);
  }

  @Post('/file/:id')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (_, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = path.extname(file.originalname);
          const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
          cb(null, filename);
        },
      }),
      fileFilter: (_, file, cb) => {
        if (!file.originalname.match(/\.(pdf)$/)) {
          return cb(new Error('Only pdf files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Lista allegati da collegare al todo',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiOperation({
    summary:
      "Inserisci gli allegati per il todo di cui l'id è stato passato all'api",
  })
  @ApiResponse({ status: 201, description: 'Files inseriti con successo' })
  @ApiResponse({ status: 400, description: 'Richiesta mal formata' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Non trovato' })
  @ApiResponse({ status: 500, description: 'Errore non previsto' })
  public uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Param('id') id: number,
  ) {
    return this.todoService.addFiles(id, new FileUploadDto(files));
  }

  @Get('/file/:idFile')
  @ApiOperation({
    summary: "Permette di scaricare un file specificandone l'id",
  })
  @ApiResponse({ status: 200, description: 'Download del file' })
  @ApiResponse({ status: 400, description: 'Richiesta mal formata' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Non trovato' })
  @ApiResponse({ status: 500, description: 'Errore non previsto' })
  public async downloadFile(
    @Param('idFile') idFile: number,
    @Res() response: Response,
  ) {
    const file = await this.todoService.findFile(idFile);
    const filePath = path.join(process.cwd(), 'uploads', file.fileName);
    response.download(filePath, file.fileName, (err) => {
      console.info(err);
      err && response.status(404).json({ message: 'File non trovato' });
    });
  }
}
