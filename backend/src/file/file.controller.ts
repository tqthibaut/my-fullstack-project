import { Controller, Get } from '@nestjs/common';
import { FileService } from './file.service';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('files')
export class FileController {
  constructor(private fileService: FileService) {}

  // @Public()
  @Get('default-profile-images')
  async getDefaultProfileImages() {
    const imageUrls = await this.fileService.getDefaultProfileImages();
    return imageUrls;
  }
}
