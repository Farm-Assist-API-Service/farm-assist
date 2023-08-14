import { Test, TestingModule } from '@nestjs/testing';
import { ProfileInformationController } from './profile-information.controller';

describe('ProfileInformationController', () => {
  let controller: ProfileInformationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileInformationController],
    }).compile();

    controller = module.get<ProfileInformationController>(ProfileInformationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
