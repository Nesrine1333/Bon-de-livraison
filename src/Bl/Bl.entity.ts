// bl.entity.ts
import { User } from 'src/user/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn } from 'typeorm';

@Entity({name: 'Bl'})
export class Bl {
    @PrimaryGeneratedColumn({ type: 'bigint'})
    id: number;


  //reference men win tji ?

    @Column()
    dateBl: Date;


  //Destinaraire
    @Column()
    nomDest: string;

    @Column()
    numTelephone1:string  ;

    
    @Column()
    numTelephone2:string  ;

    @Column()
    address:String;

    @Column()
    gov:string;

    @Column({ nullable: true })
    delegation:string;

    //Colis

    @Column()
    desc: string;

   /* @Column()
    prixLiv: number;//besh nzidu 3lih tva //shnuwa el fonction mta3 tva= 8.00=fraislivra*/

    @Column()
    prixHliv: number |null;//cr_bt 

    @Column()
    etatC: boolean;

    @Column()
    quantite:number;

    @Column()
    reference:string;

    @Column({ nullable: true })
    blname:string;

    @ManyToOne(()=> User,(user)=> user.bonDeLiv)
    @JoinColumn({ name: 'userId'  })
    user: User


}
