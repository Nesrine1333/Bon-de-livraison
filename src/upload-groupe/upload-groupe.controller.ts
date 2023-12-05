import { BadRequestException, Controller, InternalServerErrorException, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UploadGroupeService } from './upload-groupe.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('upload-groupe')
export class UploadGroupeController {

    constructor(private uploadServicce:UploadGroupeService){}

    @Post('upload-excel/:fileName')
    @UseInterceptors(FileInterceptor('file'))
    async uploadExcel(@UploadedFile() file, @Param('fileName') fileName: string) {
        try {
            if (!file) {
                throw new BadRequestException('No file uploaded.');
            }
    
            const data = await this.uploadServicce.readExcel(file.path);
    
            if (data && data.length > 0) {
                await this.uploadServicce.saveDataFromExcel(data);
                return { message: 'Data uploaded successfully.' };
            } else {
                throw new BadRequestException('No valid data found in the Excel file.');
            }
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException('Error uploading Excel file.');
        }
    }
}
