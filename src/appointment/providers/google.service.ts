import { promises } from 'fs';
import { google } from 'googleapis';
import { authenticate } from '@google-cloud/local-auth';
import { FsService } from 'src/file/services/fs.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class GoogleService {
  private readonly logger: Logger;

  public readonly meet: GoogleMeet;

  private readonly SCOPES: string[];

  constructor(private fsService: FsService) {
    this.SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
    this.logger = new Logger(GoogleService.name);
    this.meet = new GoogleMeet();
  }

  private async authorize() {
    let client: any = await this.loadSavedCredentialsIfExist();
    if (client) {
      return client;
    }
    const CREDENTIALS_PATH = (
      await this.fsService.readFile(`${__dirname}'/credentials.json'`)
    ).toString();

    client = await authenticate({
      scopes: this.SCOPES,
      keyfilePath: CREDENTIALS_PATH,
    });

    if (client.credentials) {
      await this.saveCredentials(client);
    }
    return client;
  }

  private async loadSavedCredentialsIfExist() {
    try {
      const TOKEN_PATH = await promises.readFile(
        `${__dirname}/credentials.json`,
      );
      const content = TOKEN_PATH.toString();
      const credentials = JSON.parse(content);
      return google.auth.fromJSON(credentials);
    } catch (err) {
      return null;
    }
  }

  private async listEvents(auth) {
    const calendar = google.calendar({ version: 'v3', auth });
    //... rest of the code to list events
  }

  private async saveCredentials(json: object) {
    await this.fsService.saveJSON(json);
  }
}

class GoogleMeet {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger(GoogleMeet.name);
  }

  async createMeet(): Promise<string> {
    this.logger.log(`Created Google Meet!`);
    return 'https://meet.com?code=sjj-jje';
  }
}
