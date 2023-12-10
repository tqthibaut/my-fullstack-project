import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileService {
  private readonly imagesPath = path.join(__dirname, '../../public/profile-images');

  async getDefaultProfileImages(): Promise<string[]> {
    const filenames = fs.readdirSync(this.imagesPath);
    return filenames.map(filename => `profile-images/${filename}`);
  }
}