import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';
import { AuthService } from 'src/auth/services/auth/auth.service';
import { PostUserDto } from 'src/user/dtos/post-user.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {

    constructor(private authService: AuthService) { }

    @Post('login')
    @Public()
    @ApiOperation({ summary: 'Effettua il login ' })
    @ApiResponse({ status: 201, description: 'Token di accesso' })
    @ApiResponse({ status: 400, description: "Richiesta mal formata" })
    @ApiResponse({ status: 404, description: 'Non trovato' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 500, description: 'Errore non previsto' })
    public login(@Body() user: PostUserDto) {
        return this.authService.signIn(user)
    }

    @Post('register')
    @Public()
    @ApiOperation({ summary: 'Effettua la registrazione ' })
    @ApiResponse({ status: 201, description: 'Token di accesso' })
    @ApiResponse({ status: 400, description: "Richiesta mal formata" })
    @ApiResponse({ status: 404, description: 'Non trovato' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 500, description: 'Errore non previsto' })
    public register(@Body() user: PostUserDto) {
        return this.authService.register(user)
    }

}
