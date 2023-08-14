import { Test, TestingModule } from '@nestjs/testing';
import { ProfileInformationService } from './profile-information.service';

describe('ProfileInformationService', () => {
  let service: ProfileInformationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProfileInformationService],
    }).compile();

    service = module.get<ProfileInformationService>(ProfileInformationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
