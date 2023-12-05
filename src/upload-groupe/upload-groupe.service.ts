import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as exceljs from 'exceljs';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { parse } from 'uuid';
import * as uuid from 'uuid';
import * as crypto from 'crypto';

@Injectable()
export class UploadGroupeService {

    constructor(){}
    
    //you don't need the function keywrd when using a function in a service 
    async readExcel(filePath: string) {
        const workbook = new exceljs.Workbook();
        await workbook.xlsx.readFile(filePath);
      
        // Access worksheets and extract data
        const worksheet = workbook.getWorksheet(1);
        const data = worksheet.getSheetValues();
      
        return data;
      }

      
     uuidv4ToInt(uuidValue) {
      // Remove dashes and convert to lowercase
      //const hexString = uuidValue.replace(/-/g, '').toLowerCase();
    
      // Use parseInt with base 16 to convert hex to decimal
      //const uuidAsInt = parseInt(hexString, 16);
      const parsedUuid = parse(uuidValue);
      const numericValue = parseInt(crypto.createHash('md5').update(uuidValue).digest('hex'), 16);

      return numericValue;
    }

    async saveDataFromExcel(data: any[]) {
      // Generate IDs for Destinataire and Colis
      const ids = data.slice(2).map(() => this.uuidv4ToInt(uuidv4()));
    
      // Map Excel data to Destinataire entity model, starting from the third row
      const mappedDestinataireData = data.slice(2).map((row, index) => ({
        id: ids[index],
        nom: row[1] || '',
        numTelephone: !isNaN(row[2]) ? row[2] : null,
        address: row[4] || '',
        gov: row[5] || '',
        // ...
      }));
    
      // Map Excel data to Colis entity model, starting from the fourth row
      const mappedColisData = data.slice(3).map((row, index) => ({
        id: ids[index],
        desc: row[0] || '',
        prixHliv: !isNaN(row[8]) ? row[8] : null,
        // Add other properties as needed
      }));
    
      // Save to the database
   
    }
}
