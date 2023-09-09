import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { Promocode } from './types';
import { ValidatorService } from './validator';
import { ConfigModule } from '@nestjs/config';
import { GeoProvider } from './geo-provider';
import { NotFoundException } from '@nestjs/common';

const PromocodeMock: Promocode = {
    name: 'WeatherCode1',
    advantage: {
        percent: 20
    },
    restrictions: [
        {
            '@date': {
                after: new Date('2019-01-01'),
                before: new Date('2024-06-30')
            }
        },
        {
            '@or': [
                {
                    '@age': {
                        eq: 40
                    }
                },
                {
                    // @ts-ignore
                    '@and': [
                        {
                            '@age': {
                                lt: 30,
                                gt: 20
                            }
                        },
                        {
                            "@meteo": {
                                is: 'clear',
                                temp: {
                                    lt: 15
                                }
                            }
                        }
                    ]
                }
            ]
        }
    ]
};

const ClaimPromoMock = {
    promocode_name: 'WeatherCode1',
    arguments: {
        age: 40,
        meteo: { town: 'Lyon' }
    }
};

describe('AppService', () => {
    let service: AppService;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule.forRoot()],
            providers: [AppService, ValidatorService, GeoProvider],
        }).compile();

        service = app.get<AppService>(AppService);
    });

    it('Store should contain promocode', () => {
        service.save(PromocodeMock);
        expect(service.store).toEqual([PromocodeMock]);
    });

    it('Should throw if code not found', async () => {
        const ClaimPromoMock = {
            promocode_name: 'WeatherCode2',
            arguments: {
                age: 40,
                meteo: { town: 'Lyon' }
            }
        };
        await expect(service.claim(ClaimPromoMock))
            .rejects.toEqual(new NotFoundException('requested code was not found'));
    });

    it('Should return accepted status with advantage', async () => {
        service.save(PromocodeMock);
        await expect(service.claim(ClaimPromoMock)).resolves.toEqual({
            promocode_name: 'WeatherCode1',
            status: 'accepted',
            advantage: PromocodeMock.advantage
        });
    });

    it('Should return denied status with reasons', async () => {
        const ClaimPromoMock = {
            promocode_name: 'WeatherCode1',
            arguments: {
                age: 25,
                meteo: { town: 'Lyon' }
            }
        };
        await expect(service.claim(ClaimPromoMock)).resolves.toEqual({
            promocode_name: 'WeatherCode1',
            status: 'denied',
            reasons: 'requirements for @or were not met'
        });
    });
});
