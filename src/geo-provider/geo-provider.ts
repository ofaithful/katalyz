import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CurrentWeather, GeoLocation } from './geo-types';

@Injectable()
export class GeoProvider {
    constructor(private config: ConfigService) {}

    async getCurrentWeather(city: string): Promise<CurrentWeather> {
        const key = this.getApiKey();
        const location = await this.getLocation(city);

        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${key}&units=metric`);
        const data = await response.json();

        return {
            temp: data.main.temp,
            main: data.weather[0].main.toLowerCase()
        };
    }

    private getApiKey(): string {
        const key = this.config.get<string>('API_KEY');
        if (!key) {
            throw new Error('missing api key');
        }
        return key;
    }

    private async getLocation(city: string): Promise<GeoLocation> {
        const key = this.getApiKey();
        const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${key}`);
        const data = await response.json();

        if (!data.length) {
            throw new UnprocessableEntityException('unable to decode provided city');
        }

        return {
            lat: data[0].lat,
            lon: data[0].lon
        }
    }
}
