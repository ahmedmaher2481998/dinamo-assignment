import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { isPublic } from './auth/decorators';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @isPublic()
  @ApiTags('root')
  getHello(): string {
    return this.appService.getHello();
  }
}
