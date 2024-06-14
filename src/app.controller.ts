import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/decorators/public.decorator';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags("Check")
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Check per vedere se il servizio è su' })
  @ApiResponse({ status: 200, description: "Operazione avvenuta con successo" })
  getHello(): string {
    return this.appService.getHello();
  }
}
