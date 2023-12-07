import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as exceljs from 'exceljs';
import { DeepPartial, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { parse } from 'uuid';
import * as uuid from 'uuid';
import * as crypto from 'crypto';
import { Workbook } from 'exceljs';
import { Bl } from '../bl/bl.entity';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UploadGroupeService {

    constructor(@InjectRepository(Bl)
    private blRepository: Repository<Bl>, private userService:AuthService){}
    
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

    async saveDataFromExcel(id:number,data: any[]) {

      const user= await this.userService.findOneById(id);
      // Generate IDs for Destinataire and Colis
      //const generatedIds = data.slice(1).map(() => this.uuidv4ToInt(uuidv4()));


      const currentDate = new Date()
    
      // Map Excel data to Destinataire entity model, starting from the third row
      const mapped = data.slice(1).map((row,index) => ({
        dateBl: new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate()
        ),
        
        nomDest: row[1] || '',
        etatC: false, // Default value
        quantite: 1, // Default value
        delegation:'',// ... other fields
        user: user,
        numTelephone1: row[2] ,
        numTelephone2:  row[3] ,
        address: row[4] || '',
        gov: row[5] || '',
        prixHliv:   row[7],
        desc: row[6] || '',
        reference: row[8] ,
        
      }));
      // Map Excel data to Colis entity model, starting from the fourth row
     
      const deepPartialMapped: DeepPartial<Bl>[] = mapped;

// Save to the database
this.blRepository.create(deepPartialMapped);
await this.blRepository.save(deepPartialMapped);

    
      // Save to the databas
     
   
    }

    async ExcelFile(): Promise<string> {
    
      const workbook = new exceljs.Workbook();
      const worksheet = workbook.addWorksheet('EXEL');
  
      // Add headers
      worksheet.addRow(['nom', 'numTelephone', 'address','gov', 'delegation', 'bonDeLiv']);
  
      // Save the workbook to a file
      const filePath = `exel_data.xlsx${Date.now()}.xlsx`;
      await workbook.xlsx.writeFile(filePath);
  
      return filePath;
    }

//creation exel file
    async downloadExelSheet(){
      let rows=[]
       //creation workbook
       let book = new Workbook();
       // add a woorksheet to workbook
       let sheet = book.addWorksheet('sheet1')
       // add the header
       rows.unshift((Object))
       //add multiple rows
       sheet.addRows(rows)
    
  }



}
