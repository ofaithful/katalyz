import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Promocode, ClaimPromocodeInput, ClaimSuccess, ClaimFailure } from './types';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Post('/save')
    saveCode(@Body() body: Promocode): Promise<string> {
        return this.appService.save(body);
    }

    @Post('/claim')
    claimCode(@Body() body: ClaimPromocodeInput): Promise<ClaimSuccess | ClaimFailure> {
        return this.appService.claim(body);
    }

}
