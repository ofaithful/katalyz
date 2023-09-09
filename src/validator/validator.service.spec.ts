import { Test, TestingModule } from '@nestjs/testing';
import { ValidatorService } from './validator.service';
import { GeoProvider } from '../geo-provider';
import { ConfigModule } from '@nestjs/config';

describe('ValidatorService', () => {
  let service: ValidatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [ValidatorService, GeoProvider],
    }).compile();

    service = module.get<ValidatorService>(ValidatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
