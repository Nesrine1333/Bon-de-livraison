import { Bl } from "src/bl/Bl.entity";
import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";

@Entity('user')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nom: string;

    @Column()
    matriculeFiscale: string;

    @Column()
    phoneNumber: number;

    @Column()
    gover: string;

    @Column()
    adress: string;


    @Column({ unique: true })
    email: string;

    @Column() 
    logo: string;

    @Column()
    password: string;

    @Column()
    fraisLivraison: number;//prixLiv

    @Column({ nullable: true })
    resetCode: number;

   @OneToMany(() => Bl, (bonDeLiv) => bonDeLiv.user)
   bonDeLiv: Bl[];

}