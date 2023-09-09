import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Post('/save')
    saveCode(@Body() body: any): Promise<string> {
        return this.appService.save();
    }

    @Post('/claim')
    claimCode(@Body() body: any): Promise<string> {
        return this.appService.claim();
    }

}
