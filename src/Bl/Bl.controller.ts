import { Controller, Post, Get, Body, Param, Delete, ParseIntPipe,Res,DefaultValuePipe,Query } from '@nestjs/common';

import { BlService } from './Bl.service';
import { CreateBlDto } from './DTO/CreateBl.dto';
import { Bl } from './Bl.entity';
import * as path from 'path';
import * as PDFDocument from 'pdfkit';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import {join } from 'path';
import * as fs from 'fs';
import { readdirSync } from 'fs';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { ICustomPaginationOptions } from './DTO/ICustomPaginationOptions';



  

@Controller('bl')
export class BlController {
    constructor(private BlService: BlService
    ) { }

    //Api findAll BLs
    @Get()
    findAll() {
        return this.BlService.findAll();
    }

    //API find BL by id 
    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.BlService.findOne(+id)
    }

    //API Delete BL by ID
    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.BlService.remove(id)
    }


    //getBdlbydestinataireName

 /*   @Get(':id/colis')
    findColidByBlId(@Param('id') id: number){
     return this.BlService.findColisByBlId(id);
    }*/

    @Get(':id/User')
    async findUserByUserId(@Param('id')userId: number){
        return this.BlService.findUserByBlId(userId)
    }


  /*  @Get(':id/')
    async savePDF(filePath: string, res: Response,@Param('id') id: number): Promise<void> {


      try {
          const buffer = fs.readFileSync(filePath);
    

          res.set({
              'Content-Type': 'application/pdf',
              'Content-Disposition': `attachment; filename=${filename}`,
              'Content-Length': buffer.length.toString(),
          });
    
          // Envoyer le fichier au client
          res.end(buffer);
    
          
          // Supprimer le fichier après l'envoi (facultatif)
          fs.unlinkSync(filePath);
    
      } catch (error) {
          // Gérer les erreurs de lecture du fichier
          console.error('Erreur lors de la lecture du fichier PDF:', error);
          res.status(500).json({ message: 'Internal Server Error' });
      }
    }*/

    
    @Get(':idBl/createpdf')
    async generatePdf(@Param('idBl') idBl: number, @Res() res: Response) {
        try {

        const bl = await this.BlService.findOne(idBl);
        const user=await this.BlService.findUserByBlId(idBl);
      


        const fs = require("fs");
        const PDFDocument = require("pdfkit-table");
        const pdfDoc =new PDFDocument({ margin: 30, size: 'A4', });




// draw some text

const image =user.logo;
const x = 50;
const y = 150;

const imagePath = path.resolve(__dirname, '..', '..', 'uploads', image);



       let mosntant 

      mosntant=((bl.quantite*bl.cr_bt)+user.fraisLivraison).toString();
        // Coordinates for the center
        

 pdfDoc.fontSize(11)
        .text(' ')
        .text(`CR: ${mosntant}`,250,30)
        .text(`Information Déstinateur: `,{align:'left'})
        .text(`Nom:${bl.nom_prenom}`,{align:'left'})
        .text(`Tel:${bl.tel1}`,{align:'left'})
        .text(`Adress:${bl.adresse}`,{align:'left'})
        .text(`Dscription: ${bl.description}`)
        .moveDown();



        pdfDoc
          .text("Référence transporteur",20,20)
          .moveDown();
        // Information Destinataire
    pdfDoc.lineWidth(2)
      .moveTo(50,50 )
      .rect(20, 35,100, 30, 40)
      .stroke()
      .moveDown(); 
 

 
        // Information Expediteur
        pdfDoc.fontSize(11)
        .text(' ')
        .text(' ')
        .text(`Information Expediteur`)
        .text(`Nom:${user.nom}`)
        .text(`MF:${user.matriculeFiscale}` )  
        .text(`Adress:${user.adress}`)  
        .text(`Gouvernorat:${user.gover}`)
        .text('',{align:'left'})
        .moveDown()
     
        const leftColumnX = 50;
        const columnGap = 50;  // Adjust the gap between columns
        const rightColumnX = leftColumnX + columnGap;  // Calculate the X-coordinate for the right column
        const textOptions = {font:'Times-Roman',fontSize: 12};

  

        const xUpperRight = pdfDoc.page.width - 120; // Adjust as needed
        const yUpperRight = 10; // Adjust as needed
        
        // Coordinates for the center
        const xCenter = pdfDoc.page.width / 2;
        const yCenter = pdfDoc.y;
        pdfDoc.image(imagePath, 20,200, { width: 80 }).text(`${user.nom}`)
     
        pdfDoc.fontSize(11)
          .font('Helvetica')
          .text(`Bon de Livraison No: ${bl.external_ref}`,400,200)
          .text("Date d'enlévement:dat",{align:'center'})// Set font size to 18
            .moveDown();

        pdfDoc.text(`Information Destinateur`,20,300)
        .text(`Nom:${bl.nom_prenom}`)
       .text(`Tel:${bl.tel1}`)
        .text(`Address:${bl.adresse}`)


        pdfDoc.fontSize(9)
          .font('Helvetica')
          .text('Livreur:', { align: 'left'}) // Set font size to 12
            .text('Code livreur:')
            .moveDown();
         //y el ktiba


         pdfDoc.font('Helvetica-Bold')
          // requires

         pdfDoc.fontSize(7)  
          .text("`Total Piéces= ${bl.quantite}`", { align: 'left',
          })
          .moveDown()        

        const formattedDate = bl.dateBl.toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        });

        pdfDoc.y=500;

     
        // Information Destinataire
  
        // Information Expediteur
        const desc=bl.description.toString();

        const prix=bl.cr_bt.toString();

        const Livraison=user.fraisLivraison.toString();//user.frai

        const quantite=1. //bl.quantite.toString();

        const tableQuantite=quantite.toString();
       
        const addDivider = (x1, y1, x2, y2) => {
          pdfDoc
            .createPage([x2 - x1, 2]) // Assuming the line height is 2 (adjust as needed)
            .drawLine({
              start: { x: 0, y: 0 },
              end: { x: x2 - x1, y: 0 },
              color: rgb(0, 0, 0), // Adjust color as needed
              thickness: 1, // Adjust thickness as needed
            })
            .moveDown();
        };
        
        const addPadding = (text, x, y, options) => {
          pdfDoc.text(text, { x: x + 5, y, ...options }); // Adjust padding as needed
        };

        const name=(await this.BlService.findOne(idBl)).blname;
        
        let montant,prixTot,montant2,tva,ttc;

        if (name.startsWith('excel')){

           montant=((bl.cr_bt-user.fraisLivraison)*quantite).toString();
           prixTot=(bl.cr_bt*quantite).toString();
           montant2=(((bl.cr_bt*quantite))*0.81).toString();
           tva=(((bl.cr_bt*quantite))*0.19).toString();
           ttc=(bl.cr_bt*quantite).toString();

        }else{  
          
          
           montant=(bl.cr_bt*quantite).toString();//cr_bt-user.livraison 

           prixTot=(bl.cr_bt*quantite+user.fraisLivraison).toString();//prixLiv =userFrais
  
          
           montant2=((bl.cr_bt*quantite)+user.fraisLivraison).toString();//montnat2*91%
    
           tva=(((bl.cr_bt*quantite)+user.fraisLivraison)*0.19).toString();//à demandé 
    
    
           ttc=((bl.cr_bt*quantite)+user.fraisLivraison+tva).toString();//somme montan2+tva
        }

        pdfDoc.font('Helvetica-Bold')
          // requires 
        const table = {
           title: "Details",
           divider: {
             header: { disabled: false},
             horizontal: { disabled: false, width: 1, opacity: 1 },
             padding: 5,
             columnSpacing: 10,
           },
           headers: [
            { label: "Description",headerColor:"#4253ed", headerOpacity:1  },
            { label: "Prix" ,headerColor:"#4253ed", headerOpacity:1},
            { label: "Quantité",headerColor:"#4253ed", headerOpacity:1 },
            { label: "Montant",headerColor:"#4253ed", headerOpacity:1 },
          ],
           rows: [
             [desc, prix, tableQuantite,montant],
             ["Livraison", "", "",Livraison],
             ["Total", "", "",prixTot],
          ],
         };
         pdfDoc.table( table, { 
         //   A4 595.28 x 841.89 (portrait) (about width sizes)
         //  width: 300,
            columnsSize: [ 300, 100, 70,70 ],
            prepareHeader: () => pdfDoc.fontSize(10)
            .fill('black'),
            prepareRow: (row, indexColumn, indexRow, rectRow) => {
              pdfDoc.font("Helvetica-Bold").fontSize(8);
              indexColumn === 0 && pdfDoc.addBackground(rectRow, '#e6e8f5', 0.15);
            },
         }); 

         pdfDoc.fontSize(7)  
          .text(`Total Piéces= ${bl.quantite}`, { align: 'left',
          })
          .moveDown();
        

         /* const width = pdfDoc.widthOfString('Dates pervisionelles');
          const height = pdfDoc.currentLineHeight(0);
         /* pdfDoc.fontSize(12)
          .font('Helvetica-Bold')
          .underline(20, 0, width, height)
          .text(`Dates pervisionelles`, { align: 'left'}) // Set font size to 16
            .moveDown();*/


        
        //pdfDoc.text(`Destinataire Data:\n${JSON.stringify(destinataire)}`);

        const date = new Date();
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');



        

        const formattedDateTime = `${bl.id}-${year}-${month}-${day}_${hours}-${minutes}`;
         // Format date as 'YYYY-MM-DD'
    
        // Set headers for PDF download
        const dirPath = path.resolve(process.cwd(), '../BonDeLivraison');
        const dirPath2 = path.resolve(process.cwd(), 'Downloads');



        console.log('Directory path:', dirPath);
  
        if (!fs.existsSync(dirPath)) {
          console.log('Creating directory: downloads');
          fs.mkdirSync(dirPath, { recursive: true });
        }
  
      // const filePathlocal = `pdfdata.pfd${Date.now()}.pdf`;
      const filePathlocal = path.resolve(dirPath,  formattedDateTime+'.pdf');
      const filePathserver = path.resolve(dirPath2,  formattedDateTime+'.pdf');

      
        console.log('File path:', filePathlocal );
  
        await new Promise<void>((resolve, reject) => {
          pdfDoc.pipe(fs.createWriteStream(filePathlocal, { mode: 0o644 }))
            .on('finish', () => {
              console.log('File writing finished');
        
              // Ensure that the destination directory exists
              if (!fs.existsSync(dirPath2)) {
                console.log('Creating directory: Downloads');
                fs.mkdirSync(dirPath2, { recursive: true });
              }
        
              // Now, copy the file to the second directory
              fs.copyFile(filePathlocal, filePathserver, (err) => {
                if (err) {
                  console.error('Error copying file:', err);
                  reject(err);
                } else {
                  console.log('File copied to second directory');
                  resolve();
                }
              });
            })
            .on('error', (error) => {
              console.error('File writing error:', error);
              reject(error);
            });
        
          pdfDoc.end();
        });
  
        console.log(`File path: ${filePathlocal }`);
  
        res.header('Content-Type', 'application/pdf');
        res.header('Content-Disposition', `attachment; filename=${formattedDateTime}`);
       // res.download(filePath);
       // res.json(bl.id);
        res.sendFile(filePathlocal);
        

      //  await this.savePDF(filePathlocal, res, formattedDateTime);
      return bl.id
      } catch (error) {
        console.error(error);
        res.status(404).json({ message: 'Destinataire not found' });
    }
  }



 

  @Post(':idUser/createbl')
  async create(@Param('idUser', ParseIntPipe) idUser: number, @Body() createBlDto: CreateBlDto, @Res() res: Response) {
    try {
        const bl = await this.BlService.create(idUser, createBlDto);
        await this.generatePdf(bl.id, res);
        res.json(bl.id);
        return bl;
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating BL or generating PDF' });
    }
  }
  @Get(':id/file')
  async downloadFile(@Param('id') id: number, @Res() res: Response) {
    // Assume files are stored in a directory named 'downloads'
    const directoryPath = join(process.cwd(), '../BonDeLivraison');

    // Get the list of files in the directory
    const files = readdirSync(directoryPath);

    // Find the file that matches the given id in its name
    const filename = files.find((file) => file.startsWith(`${id}-`));

    if (!filename) {
      // If no matching file is found, send an error response
      return res.status(404).send('File not found');
    }

    // Construct the full file path
    const filePath = join(directoryPath, filename);

    // Set the headers for the response
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=${filename}`,
    });

    // Send the file as the response
    res.sendFile(filePath);
  }



  @Get(':id/downloadImported')
  async downloadFileFromExcel(@Param('id') id: number, @Res() res: Response){
     const bl= await this.BlService.findOneById(id);
    
    await this.generatePdf(bl.id,res);
    
    
    const directoryPath = join(process.cwd(), '../BonDeLivraison');
        const files = readdirSync(directoryPath);

    // Find the file that matches the given id in its name
    const filename = files.find((file) => file.startsWith(`${id}-`));

    if (!filename) {
      // If no matching file is found, send an error response
      return res.status(404).send('File not found');
    }

    // Construct the full file path
    const filePath = join(directoryPath, filename);

    // Set the headers for the response
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=${filename}`,
    });

    // Send the file as the response
    res.sendFile(filePath);
    

  }

  @Get(':idUser/getAllBlByUser')
  async getBlByUserId(@Param('idUser') userId: number): Promise<Bl[]> {
    return await this.BlService.getBlByUserId(userId);
  }


  @Get(':idUser/getAllBlByUser/:page/:limit')
  async pagginate(@Param('idUser',new ParseIntPipe()) userId: number,
  @Param('page', ParseIntPipe) page: number,@Param('limit', ParseIntPipe) limit: number ,
): Promise<Bl[]> {
  const options: IPaginationOptions = {
    page,
    limit,
    route: `${userId}/getBLPagination`,
  };

  return this.BlService.paginate(userId, options);
}
  
    @Get(':idUser/:dest/getAllBlByDest/:page/:limit')
    async getBlByDest(@Param('idUser', ParseIntPipe) userId: number,
      @Param('dest') dest: string,
      @Param('page', ParseIntPipe) page: number,@Param('limit', ParseIntPipe) limit: number  ,
    ): Promise<Bl[]> {
      const options: IPaginationOptions = {
        page,
        limit,
        route: `${userId}/${dest}/getAllBlByDest`,
      };

      return this.BlService.getBlByDestinataire(userId,dest, options);
    }

    @Get(':idUser/:date/byDate/:page/:limit')
    async getBlByDate(@Param('idUser', ParseIntPipe) userId: number,
      @Param('date') dateString: Date,
      @Param('page', ParseIntPipe) page: number,@Param('limit', ParseIntPipe) limit: number ,
    ): Promise<Bl[]> {
      
      const options: IPaginationOptions = {
        page,
        limit,
        route: `${userId}/${dateString}/byDate`, 
      };

  return this.BlService.getBlByDate(userId,dateString, options);
}


  @Get(':idUser/:name/getAllBlByName/:page/:limit')
  async getBlByName(@Param('idUser', ParseIntPipe) userId: number,
    @Param('name') name: string,
    @Param('page', ParseIntPipe) page: number,@Param('limit', ParseIntPipe) limit: number ,
  ): Promise<Bl[]> {
    const options: IPaginationOptions = {
      page,
      limit ,
      route: `${userId}/${name}/getAllBlByName`, 
    };

  return this.BlService.getBlByGove(userId,name, options);
}

@Get(':idUser/getAllBlByUserFilter/:page/:limit')
async getBlByUserIdAndFiltrage(
  @Param('idUser', ParseIntPipe) userId: number,
  @Param('page', ParseIntPipe) page: number,@Param('limit', ParseIntPipe) limit: number,
  @Query('dateBl') dateBl?: Date,
  @Query('nomDest') nomDest?: string,
  @Query('blname') blname?: string, 
): Promise<Bl[]> {
  const options: ICustomPaginationOptions = {
    page,
    limit,
    route: `${userId}`,
    filters: {
      dateBl,
      nomDest,
      blname,
    },
  };

  return this.BlService.paginateFiltrage(userId, options);
}




}
function rgb(arg0: number, arg1: number, arg2: number) {
    throw new Error('Function not implemented.');
}

