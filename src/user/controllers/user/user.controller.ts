import { Controller, Delete, Get, Param, Res } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { UserService } from 'src/user/services/user/user.service';

@Controller('users')
@ApiTags('User')
@ApiBearerAuth()
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/')
  @ApiOperation({ summary: 'Ritorna la lista degli utenti ' })
  @ApiResponse({ status: 200, description: 'Lista utenti' })
  @ApiResponse({ status: 400, description: 'Richiesta mal formata' })
  @ApiResponse({ status: 404, description: 'Non trovato' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 500, description: 'Errore non previsto' })
  public listaUtenti() {
    return this.userService.findAll();
  }

  @Delete('/:idUtente')
  @ApiOperation({
    summary: 'Elimina un utente dall lista degli utenti del sistema ',
  })
  @ApiResponse({ status: 204, description: 'Utente rimosso con successo' })
  @ApiResponse({ status: 400, description: 'Richiesta mal formata' })
  @ApiResponse({ status: 404, description: 'Non trovato' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 500, description: 'Errore non previsto' })
  public rimuoviUtente(
    @Param('idUtente') idUtente: number,
    @Res() res: Response,
  ) {
    return res.status(204).json(this.userService.remove(idUtente));
  }
}
