import { Test, TestingModule } from '@nestjs/testing';
import { GeoProvider } from './geo-provider';
import { ConfigModule } from '@nestjs/config';
import { UnprocessableEntityException } from '@nestjs/common';

// @ts-ignore
global.fetch = jest.fn();

const GeoResponseMock = [
  {
      name: 'London',
      local_names: {
        ms: 'London',
      },
      lat: 51.5073219,
      lon: -0.1276474,
      country: 'GB',
      state: 'England'
  },
];

const WeatherResponseMock = {
  coord: {
    lon: -0.1276474,
    lat: 51.5073219
  },
  weather: [
    {
      id: 501,
      main: 'Rain',
      description: 'moderate rain',
      icon: '10d'
    }
  ],
  base: 'stations',
  main: {
    temp: 298.48,
    feels_like: 298.74,
    temp_min: 297.56,
    temp_max: 300.05,
    pressure: 1015,
    humidity: 64,
    sea_level: 1015,
    grnd_level: 933
  },
  visibility: 10000,
  wind: {
    speed: 0.62,
    deg: 349,
    gust: 1.18
  },
  rain: {
    '1h': 3.16
  },
  clouds: {
    all: 100
  },
  dt: 1661870592,
  sys: {
    type: 2,
    id: 2075663,
    country: 'IT',
    sunrise: 1661834187,
    sunset: 1661882248
  },
  timezone: 7200,
  id: 3163858,
  name: 'Zocca',
  cod: 200
} 



describe('GeoProvider', () => {
  let provider: GeoProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [GeoProvider],
    }).compile();

    provider = module.get<GeoProvider>(GeoProvider);

    // @ts-ignore
    fetch.mockClear();
  });

  it('getCurrentWeather should throw if provided city could not be decoded', () => {
    // @ts-ignore
    fetch.mockImplementationOnce(() => Promise.resolve({
      json: () => Promise.resolve([])
    }));

    expect(provider.getCurrentWeather('London')).rejects.toEqual(new UnprocessableEntityException('unable to decode provided city'));
  });

  it('getCurrentWeather should return weather data', () => {
    // @ts-ignore
    fetch.mockResolvedValueOnce(Promise.resolve({ json: () => GeoResponseMock }));

    // @ts-ignore
    fetch.mockResolvedValueOnce(Promise.resolve({ json: () => WeatherResponseMock }));

    expect(provider.getCurrentWeather('London')).resolves.toEqual({
      temp: WeatherResponseMock.main.temp,
      main: WeatherResponseMock.weather[0].main.toLocaleLowerCase()
    });
  });
});
