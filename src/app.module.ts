import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GeoProvider } from './geo-provider/geo-provider';

@Module({
    imports: [],
    controllers: [AppController],
    providers: [AppService, GeoProvider],
})
export class AppModule {}
