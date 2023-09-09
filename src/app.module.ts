import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GeoProvider } from './geo-provider/geo-provider';
import { ValidatorService } from './validator/validator.service';

@Module({
    imports: [ConfigModule.forRoot()],
    controllers: [AppController],
    providers: [AppService, GeoProvider, ValidatorService],
})
export class AppModule {}
