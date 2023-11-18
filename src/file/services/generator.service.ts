import { readFile } from 'fs';
import { resolve } from 'path';
import { promisify } from 'util';

import { Injectable, Logger } from '@nestjs/common';
import * as handlebars from 'handlebars';
// import { InjectBrowser } from 'nest-puppeteer';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { load } from 'cheerio';
// import { AesEncryption } from 'src/utils/aes-encryption';
// import { EmailEvent } from 'src/events/email-events.enum';
// import { SendLeadMailDto } from 'src/dtos/send-lead-mail.dto';
// import { leadGeneratorTemp } from './temp/lead-gen-template';
import { FsService } from './fs.service';
// import { ContentEvents } from 'src/events/content.events';
import { TemplateEvents } from 'src/core/enums/events/template.events';
import { ConfigService } from 'src/config/config.service';
import { HandleHttpExceptions } from 'src/utils/helpers/handle-http-exceptions';
import { SendMailPayload } from 'src/core/dtos/send-mail-payload';
import { AesEncryption } from 'src/utils/helpers/aes-encryption';
// import { Browser, PDFOptions, PaperFormat, Viewport } from 'puppeteer';

// interface FileGeneratePayload {
//   type: 'png' | 'pdf';
//   html: string;
//   format?: PaperFormat;
//   paperOptions?: { width: number; height: number };
//   viewPortOptions?: Viewport;
// }

const ReadFile = promisify(readFile);

@Injectable()
export class GeneratorService {
  protected url = '';

  private readonly logger: Logger;

  public encryption: AesEncryption;

  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly configService: ConfigService,
    private readonly fsService: FsService,
  ) {
    // @InjectBrowser() private readonly browser: Browser
    this.logger = new Logger(GeneratorService.name);
    // this.encryption = new AesEncryption(
    //   this.configService.env.EMAIL_TRACKING_PRIVATE_KEY,
    // );
    this.encryption = new AesEncryption(this.configService.env.RSA_PRIVATE_KEY);
  }

  get generateOTP(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  async getEmailTemplate(filePath: string, context: any): Promise<string> {
    this.logger.log(`Generating html...`);
    const mailsTemplate = `./src/views/emails/${filePath}`;

    const templatePath = resolve(mailsTemplate);
    const content = await ReadFile(templatePath);

    handlebars.registerHelper('ifeq', function (a, b, options) {
      if (a == b) {
        return options.fn(this);
      }
      return options.inverse(this);
    });

    handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
      switch (operator) {
        case '===':
          return v1 === v2 ? options.fn(this) : options.inverse(this);
        // Add other operators as needed...
        default:
          return options.inverse(this);
      }
    });

    // compile and render the template with handlebars
    const template = handlebars.compile(content.toString());

    return template(context);
  }

  htmlToHbs(html: string, context?: any): Promise<string> {
    if (!html) throw new Error('html cannot be empty');
    this.logger.log(`Generating hbs...`);
    handlebars.registerHelper('ifeq', function (a, b, options) {
      if (a == b) {
        return options.fn(this);
      }
      return options.inverse(this);
    });

    handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
      switch (operator) {
        case '===':
          return v1 === v2 ? options.fn(this) : options.inverse(this);
        // Add other operators as needed...
        default:
          return options.inverse(this);
      }
    });

    return new Promise((resolve, _) => {
      const template = handlebars.compile(html);
      resolve(template(context));
    });
  }

  @OnEvent(TemplateEvents.GENERATE)
  async generateTemplate(emailPayload: SendMailPayload): Promise<string> {
    let template;
    const context = emailPayload.context;
    const templateProcessor = emailPayload.html
      ? 'htmlToHbs'
      : 'getEmailTemplate';

    if (emailPayload.html) {
      const isHtml = this.fsService.isHtml(emailPayload.html);
      const html: any = new Promise((resolve, reject) => {
        try {
          const html = isHtml
            ? emailPayload.html
            : decodeURIComponent(emailPayload.html);
          resolve(html);
        } catch (error) {
          reject(error);
        }
      });
      template = await html;
    } else if (emailPayload.fileName) {
      template = emailPayload.fileName;
    } else {
      throw new Error('HTML is missing OR provide template fileName');
    }

    try {
      const htmlString = await this[templateProcessor](template, context);
      // const $ = load(htmlString);
      // const body = $('body');
      // const head = $('head');

      // if (this.configService.env.USE_TRACKING_FEATURE) {
      //   this.logger.debug(`Adding tracking URL...`);
      //   const [content] = await this.eventEmitter.emitAsync(
      //     ContentEvents.NEW,
      //     emailPayload,
      //   );

      //   const encryptionPayload = JSON.stringify({
      //     receipient: emailPayload.receipient,
      //   });

      //   const trackingId = this.encryption.encrypt(encryptionPayload);
      //   const trackingUrl = `${this.configService.env.HOST_URL}/mail/${this.configService.env.EMAIL_TRACKING_URL}?quo=${trackingId}&contentId=${content.id}`;
      //   this.logger.debug(`Tracking URL ====> ${trackingUrl}`);
      //   body.append(
      //     `<img style="height: 0px !important; width: 0px !important;" src="${trackingUrl}" />`,
      //   );
      // }

      // head.append(
      //   `
      //   <link rel="preconnect" href="https://fonts.googleapis.com">
      //   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      //   <link href="https://fonts.cdnfonts.com/css/mulish" rel="stylesheet">
      //   <style>
      //   @import url('https://fonts.cdnfonts.com/css/mulish');
      //     body * {
      //       font-family: 'Mulish', sans-serif !important;
      //     }
      //     * img { pointer-events: none !important; }
      //   </style>
      //   `,
      // );
      this.logger.debug(`🥇🥇🥇🥇Template generated successfully!!!`);
      // return $.html();
      return htmlString;
    } catch (error) {
      throw new HandleHttpExceptions({
        error,
        source: {
          service: GeneratorService.name,
          operator: this.generateTemplate.name,
        },
        report: error || 'Error generating template',
      });
    }
  }

  // async generate(payload: FileGeneratePayload): Promise<Buffer> {
  //   const {
  //     html,
  //     paperOptions,
  //     viewPortOptions,
  //     format = 'a4',
  //     type,
  //   } = payload;
  //   this.logger.log(`Generating file...`);

  //   const page = await this.browser.newPage();
  //   await page.setViewport({
  //     width: viewPortOptions?.width || 800,
  //     height: viewPortOptions?.height || 800,
  //     deviceScaleFactor: viewPortOptions?.deviceScaleFactor || 2,
  //   });

  //   await page.setContent(html, {
  //     waitUntil: ['load', 'domcontentloaded', 'networkidle0'],
  //   });

  //   await page.emulateMediaType('screen');
  //   const options: PDFOptions = { printBackground: true };
  //   if (paperOptions) {
  //     options.width = paperOptions?.width;
  //     options.height = paperOptions?.height;
  //     Object.assign(options, paperOptions);
  //   } else {
  //     options.format = format;
  //   }
  //   let buffer;
  //   if (type === 'pdf') {
  //     buffer = await page.pdf(options);
  //   } else {
  //     const content = await page.$('body');
  //     buffer = await content.screenshot({ omitBackground: true });
  //   }

  //   return buffer;
  // }
}
