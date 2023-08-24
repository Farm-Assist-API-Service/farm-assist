import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import * as fs from 'fs';
import { readFile } from 'fs';
import { resolve } from 'path';
import { promisify } from 'util';

const ReadFile = promisify(readFile);

@Injectable()
export class FsService {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger(FsService.name);
  }

  writeFile(json: object): Promise<string> {
    const resolvedPath = resolve('/');
    // return Promise.resolve(resolvedPath);
    return new Promise((resolve, reject) => {
      fs.writeFile(
        resolvedPath,
        JSON.stringify(json, null, 2),
        'utf-8',
        function (err) {
          if (err) throw err;
          console.log('Done!');
          resolve('done');
        },
      );
    });
  }

  readFile(filePath: string): Promise<string> {
    const resolvedPath = resolve(filePath);
    console.log({ resolvedPath });

    // return Promise.resolve(resolvedPath);
    return new Promise((resolve, reject) => {
      fs.readFile(resolvedPath, 'ascii', (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  readImg(filePath: string): Promise<string> {
    const resolvedPath = resolve(filePath);
    // return Promise.resolve(resolvedPath);
    return new Promise((resolve, reject) => {
      // Read the image file as a buffer
      const buffer = fs.readFileSync(resolvedPath);

      // Convert the buffer to base64 format
      const base64 = Buffer.from(buffer).toString('base64');

      // Write the buffer data to a file
      // fs.writeFileSync(resolvedPath, buffer);

      // Convert base64 data back to an image file
      return Buffer.from(base64, 'base64');
    });
  }

  isHtml(str): boolean {
    const htmlRegEx = /<\/?[a-z][\s\S]*>/i;
    return htmlRegEx.test(str);
  }
}
