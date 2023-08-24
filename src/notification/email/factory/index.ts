import { Injectable } from '@nestjs/common';

import { IEmailService } from '../../interfaces/email.interfaces';

import { EmailEngines } from '../../enums/email-engines.enum';
import { Nodemailer } from '../libs/nodemailer';

/**
 * Factory class responsible for returning a collection of Email Engines classes
 */
@Injectable()
export class EmailEngineFactory {
  emailEngines: Map<EmailEngines, IEmailService>;

  constructor(nodemailer: Nodemailer) {
    if (!this.emailEngines) {
      this.emailEngines = new Map<EmailEngines, IEmailService>();

      this.emailEngines.set(EmailEngines.NODE_MAILER, nodemailer);
    }
  }

  /**
   * Returns all emailEngines in a map
   */
  public all(): Map<EmailEngines, IEmailService> {
    return this.emailEngines;
  }

  /**
   * Returns a single emailEngine
   */
  public findOne(engine: EmailEngines): IEmailService {
    const emailEngine = this.emailEngines.get(engine);

    if (!emailEngine) {
      throw new ReferenceError(
        `Sorry. ${engine} email engine not found in factory`,
      );
    }

    return emailEngine;
  }
}
