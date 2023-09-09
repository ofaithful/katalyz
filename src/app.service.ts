import { Injectable } from '@nestjs/common';
import { GeoProvider } from './geo-provider/geo-provider';

@Injectable()
export class AppService {
    constructor(private geo: GeoProvider) {}

    async save(): Promise<string> {
        return 'save';
    }

    async claim(): Promise<string> {
        // const data = await this.geo.getCurrentWeather('kyiv');
        return 'claim';
    }
}
