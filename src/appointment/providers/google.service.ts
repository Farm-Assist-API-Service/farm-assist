import { promises } from 'fs';
import { calendar_v3, google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { authenticate } from '@google-cloud/local-auth';
import { FsService } from 'src/file/services/fs.service';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';
import {
  DateHelpers,
  YEAR_MONTH_DAY_DATE_FORMAT,
} from 'src/utils/helpers/date.helpers';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CreateAppointmentDto } from '../dtos/create-appointment.dto';
import { ProfileInformation } from 'src/user/profile-information/entities/profile-information.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EProviderStatus } from '../enums/provider-status.enum';
import { IFailedOauthTokenMail } from 'src/notification/interfaces/email.interfaces';
import { FarmAssistAppointmentProviders } from '../enums/appointment-providers.enum';

@Injectable()
export class GoogleService {
  private readonly logger: Logger;

  public meet: GoogleMeet;

  public calendar: GoogleCalendar;

  // private readonly SCOPES: string[];

  private readonly oauth2Client: OAuth2Client;

  private readonly credentialPath =
    'src/appointment/providers/credentials.json';

  private readonly SCOPES = 'https://www.googleapis.com/auth/calendar';

  public readonly eventEmitter: EventEmitter2;

  constructor(
    private fsService: FsService,
    private config: ConfigService,
    private __eventEmitter: EventEmitter2,
  ) {
    this.logger = new Logger(GoogleService.name);
    this.eventEmitter = this.__eventEmitter;
    // this.SCOPES = ['https://www.googleapis.com/auth/calendar'];

    this.oauth2Client = new OAuth2Client({
      clientId: this.config.env.GOOGLE_CLIENT_ID,
      clientSecret: this.config.env.GOOGLE_CLIENT_SECRET,
      redirectUri: this.config.env.GOOGLE_CLIENT_REDIRECT_URL,
    });
    this.init(this.oauth2Client);
  }

  init(oauth2Client: OAuth2Client) {
    this.setAuthURL(oauth2Client);
    this.setCredentials(oauth2Client);
    // init calendar
    const calendar = google.calendar({
      version: 'v3',
      auth: oauth2Client,
    });

    this.meet = new GoogleMeet(this);
    this.calendar = new GoogleCalendar(calendar);
  }

  private async setCredentials(oauth2Client: OAuth2Client) {
    this.fsService
      .readFile(this.credentialPath)
      .then(async (credentials) => {
        const json = JSON.parse(credentials);
        // console.log({ ...json });

        await oauth2Client.setCredentials({
          access_token: json.google.auth.access_token,
          refresh_token: json.google.auth.refresh_token,
        });
      })
      .catch((e) => console.log(e));
  }

  private setAuthURL(oauth2Client: OAuth2Client): string {
    // Redirect the user to the authUrl and handle the authorization code callback
    const authURL = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: this.SCOPES,
    });
    this.fsService
      .readFile(this.credentialPath)
      .then((credentials) => {
        const json = JSON.parse(credentials);
        json.google.auth.url = authURL;

        this.fsService.writeFile(this.credentialPath, json); // save authURL
      })
      .catch((e) => console.log(e));
    this.logger.debug(`Auth URL generated... ${authURL}`);
    return authURL;
  }

  get getAuthURL(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.fsService
        .readFile(this.credentialPath)
        .then((credentials) => {
          const json = JSON.parse(credentials);
          resolve(json.google.auth.url);
        })
        .catch((e) => reject(e));
    });
  }

  setAuthCode(code: string) {
    this.fsService
      .readFile(this.credentialPath)
      .then((credentials) => {
        const json = JSON.parse(credentials);
        json.google.auth.code = code;

        this.fsService.writeFile(this.credentialPath, json); // save authCode
        this.logger.debug(`Auth Code generated... ${json.google.auth.code}`);
        this.getAccessToken();
      })
      .catch((e) => console.log(e));
  }

  get getAuthCode() {
    return this.fsService.readFile(this.credentialPath);
  }

  setAccessToken(accessToken: string, refreshToken = null) {
    // Use the access token and refresh token to make API requests
    this.fsService
      .readFile(this.credentialPath)
      .then((credentials) => {
        const json = JSON.parse(credentials);
        json.google.auth.access_token = accessToken;
        json.google.auth.refresh_token = refreshToken;
        json.google.auth.expired = false;

        this.fsService.writeFile(this.credentialPath, json); // save authCode
        this.logger.verbose(
          accessToken !== json.google.auth.access_token
            ? 'New Access token generated!!'
            : `Saved Old Access token =====> ${accessToken}`,
        );
        if (refreshToken.length) {
          this.logger.verbose(`Refresh token saved... ${refreshToken}`);
        }
      })
      .catch((e) => console.log(e));
  }

  updateTokenExpiryStatus(status: boolean) {
    this.fsService
      .readFile(this.credentialPath)
      .then((credentials) => {
        const json = JSON.parse(credentials);
        json.google.auth.expired = status;
        this.fsService.writeFile(this.credentialPath, json); // update token status
        this.logger.debug(
          `Token status is set to ${String(status).toUpperCase()}`,
        );
        this.getAccessToken();
      })
      .catch((e) => console.log(e));
  }

  @Cron(CronExpression.EVERY_3_HOURS)
  async getAccessToken() {
    const oauth2Client = new OAuth2Client({
      clientId: this.config.env.GOOGLE_CLIENT_ID,
      clientSecret: this.config.env.GOOGLE_CLIENT_SECRET,
      redirectUri: this.config.env.GOOGLE_CLIENT_REDIRECT_URL,
    });

    try {
      const credentials = await this.getAuthCode;
      const json = JSON.parse(credentials);
      const code = json.google.auth.code;
      const expired = json.google.auth.expired;
      if (!expired) {
        this.logger.verbose('Access token is VALID');
        return;
      }
      const { tokens } = await oauth2Client.getToken(code);
      const accessToken = tokens.access_token;
      const refreshToken = tokens.refresh_token;

      console.log({ tokens, accessToken, refreshToken });

      this.setAccessToken(accessToken, refreshToken);
      this.updateTokenExpiryStatus(false);
    } catch (error) {
      this.logger.error('Error generating oauth tokens');
      const authURL = await this.getAuthURL;
      const failedArg: IFailedOauthTokenMail = {
        provider: FarmAssistAppointmentProviders.GOOGLE_SERVICE,
        message: `Error generating ${
          GoogleService.name
        } oauth tokens. Error: ${JSON.stringify(
          error,
        )}. Follow this link to resolve this error ${authURL}`,
      };
      this.eventEmitter.emit(EProviderStatus.TOKEN_ERROR, failedArg);

      console.log({ error });
    }

    // Make API requests using the authenticated client
  }
}

class GoogleMeet {
  private readonly logger: Logger;
  private readonly googleService: GoogleService;

  constructor(googleService: GoogleService) {
    this.logger = new Logger(GoogleMeet.name);
    this.googleService = googleService;
  }

  async createMeet(
    inputs: CreateAppointmentDto,
    host: ProfileInformation,
    guests: ProfileInformation[],
  ): Promise<string> {
    try {
      const endDate = DateHelpers.addToDate(
        inputs.date,
        inputs.duration,
        inputs.unitOfTime,
      );

      const attendees = guests.map(g => ({ email: g.user.email }));

      const response = await this.googleService.calendar.init.events.insert({
        calendarId: 'primary',
        requestBody: {
          summary: inputs.title,
          location: 'Virtual / Google Meet',
          description: inputs.description,
          start: {
            dateTime: DateHelpers.toISOString(inputs.date),
            // timeZone: 'America/New_York',
          },
          end: {
            dateTime: DateHelpers.toISOString(endDate),
            // timeZone: 'America/New_York',
          },
          attendees,
          conferenceData: {
            createRequest: {
              requestId: 'random-string',
            },
          },
          reminders: {
            useDefault: false,
            overrides: [
              { method: 'email', minutes: 24 * 60 },
              { method: 'popup', minutes: 10 },
            ],
          },
          // guestsCanSeeOtherGuests: true,
          creator: {
            displayName: host.name,
            email: host.user.email,
          },
        },
        conferenceDataVersion: 1,
        sendUpdates: 'all',
      });
      this.logger.log(`Meeting created:`);
      console.log(response.data, response);
      return response.data.hangoutLink;
    } catch (error) {
      console.error('Error creating meeting:', error);
      if (error.status !== 400) {
        this.googleService.updateTokenExpiryStatus(true);
      }

      if (error.status === 401) {
        this.googleService.updateTokenExpiryStatus(true);
      }
      // this.googleService.eventEmitter.emit(EProviderStatus.ERROR, );

      throw new Error(`Error creating meeting: ${error}`);
    }
  }
}

class GoogleCalendar {
  private readonly calendar: calendar_v3.Calendar;

  constructor(calendar: calendar_v3.Calendar) {
    this.calendar = calendar;
  }

  get init(): calendar_v3.Calendar {
    return this.calendar;
  }
}
