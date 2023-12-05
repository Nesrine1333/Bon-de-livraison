import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository,SelectQueryBuilder } from 'typeorm';
import { Bl } from './Bl.entity';
import { CreateBlDto } from './DTO/CreateBl.dto';

import { v4 as uuidv4 } from 'uuid';
import { User } from 'src/user/user.entity';
import { AuthService } from 'src/auth/auth.service';

import { parse } from 'uuid';
import * as uuid from 'uuid';
import * as crypto from 'crypto';


@Injectable()
export class BlService {
  [x: string]: any;
    //private readonly Bl:Bl[] = [];

    // Comunication with databse
    constructor(
        @InjectRepository(Bl)
        private blRepository: Repository<Bl>,
        private userService:AuthService,
        @InjectRepository(User)private userRepository:Repository<User>,
   

    ) { }



    uuidv4ToInt(uuidValue: string): number {
        const numericValue = parseInt(crypto.createHash('sha256').update(uuidValue).digest('hex'), 16);
        return numericValue;
      }
 
      generateRandomNumber(min: number, max: number): number {
        // Generate a random number between min (inclusive) and max (exclusive)
        return Math.floor(Math.random() * (max - min) + min);
      }
      
      ref = (this.generateRandomNumber(1, 100)).toString();
    // Creation BL
    async create(idUser:number ,createBlDto: CreateBlDto) {
        const user= await this.userService.findOneById(idUser);
        
      
        const idd=uuidv4()
        const blId = this.uuidv4ToInt(idd); // Generate a unique ID for Bl

        const currentDate = new Date();

        const newBonDeLiv = this.blRepository.create({
          id: blId,
          dateBl: new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate()
          ),reference:this.ref,
          ...createBlDto,
          user
        

        });
    
        // Update the Destinataire with the new Bl
       
        return this.blRepository.save(newBonDeLiv);
      }

    // find All BLs
    findAll(): Promise<Bl[]> {
        return this.blRepository.find();
    }

    // find BL by her id
    findOne(id: number): Promise<Bl | null> {
        return this.blRepository.findOneBy({ id });
    }

    // Delete BL
    async remove(id: number): Promise<void> {
        await this.blRepository.delete(id);
    }

   

    /*findBlByMonth(date: Date): Promise<Bl[]> {
        const month = date.getMonth() + 1; // Adding 1 because getMonth() returns 0-indexed months
    
        return this.createQueryBuilder('bl')
          .where('MONTH(bl.dateBl) = :month', { month })
          .getMany();
      }*/


    
    /*  async findColisByBlId(id:number): Promise<Colis>{
        const bl =await this.blRepository.findOneBy({id});
        const colisId=await this.colisRepository.findOne(bl.colis)
        return 
      }*/

      async findBlByUserId(userId: number): Promise<Bl[]> {
        return this.createQueryBuilder('bl')
          .innerJoin('bl.user', 'user')
          .where('user.id = :userId', { userId })
          .getMany();
      }
   
} 
