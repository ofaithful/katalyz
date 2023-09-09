import { Test, TestingModule } from '@nestjs/testing';
import { GeoProvider } from './geo-provider';
import { ConfigModule } from '@nestjs/config';

describe('GeoProvider', () => {
  let provider: GeoProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [GeoProvider],
    }).compile();

    provider = module.get<GeoProvider>(GeoProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
