import { Module } from '@nestjs/common';
import { PdfdownloadController } from './pdfdowload.controller';
import { PdfdownloadService } from './pdfdowload.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from 'src/auth/auth.service';

import { EmailService } from 'src/Email/email.service';
import { AuthModule } from 'src/auth/auth.module';

import { UserModule } from 'src/user/user.module';

import { User } from 'src/user/user.entity';
import { BlService } from 'src/bl/bl.service';
import { BlModule } from 'src/bl/bl.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]),AuthModule,UserModule,BlModule],
  controllers: [PdfdownloadController],
  providers: [PdfdownloadService,AuthService,EmailService,BlService],
  exports:[PdfdownloadService],
})
export class PdfdowloadModule {}
