import { Test, TestingModule } from '@nestjs/testing';
import { DataSetParserService } from './data-set-parser.service';

describe('DataSetParserService', () => {
  let service: DataSetParserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataSetParserService],
    }).compile();

    service = module.get<DataSetParserService>(DataSetParserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
