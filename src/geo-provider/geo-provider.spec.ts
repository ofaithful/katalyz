import { Test, TestingModule } from '@nestjs/testing';
import { GeoProvider } from './geo-provider';

describe('GeoProvider', () => {
  let provider: GeoProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeoProvider],
    }).compile();

    provider = module.get<GeoProvider>(GeoProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
