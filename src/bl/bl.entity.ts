// bl.entity.ts
import { User } from 'src/user/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn } from 'typeorm';

@Entity({name: 'bl'})
export class Bl {
  @PrimaryGeneratedColumn()
  id: number;

  //reference men win tji ?

    @Column()
    dateBl: Date;


  //Destinaraire
    @Column()
    nomDest: string;

    @Column()
    numTelephone:number;

    @Column()
    address:String;

    @Column()
    gov:string;

    @Column()
    delegation:string;

    //Colis

    @Column()
    desc: string;

   /* @Column()
    prixLiv: number;//besh nzidu 3lih tva //shnuwa el fonction mta3 tva= 8.00=fraislivra*/

    @Column()
    prixHliv: number;//cr_bt 

    @Column()
    etatC: boolean;

    @Column()
    quantite:number;

    @Column()
    reference:string;

    @Column()
    nameBl:String;

    @ManyToOne(()=> User,(user)=> user.bonDeLiv)
    @JoinColumn({ name: 'userId'  })
    user: User


}
