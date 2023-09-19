import { ProfileInformation } from "src/user/profile-information/entities/profile-information.entity";

export interface IChat {
  id: number;
  message: string;
  createdAt: Date;
  updatedAt: Date;
  profile: ProfileInformation;
}
