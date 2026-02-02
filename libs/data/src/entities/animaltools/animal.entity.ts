// libs/data/src/entities/animaltools/animal.entity.ts
//Enquanto o Tiago não me responde vou deixar esse arquivo assim, para depois só fazer as alterações
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  OneToMany, 
  CreateDateColumn 
} from 'typeorm';
import { DentalEvaluation } from './dental-evaluation.entity';
import { Media } from './media.entity';

@Entity('animal') 
export class Animal {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'tag_code', unique: true })   
  tagCode: string; // Código Brinco / Chave de integração Catwork

  @Column({ name: 'animal_identifier', nullable: true })
  animalIdentifier: string; // Identificador 

  @Column()
  breed: string; // Raça

  @Column({ name: 'age_in_months', nullable: true })
  ageInMonths: number; // Idade em meses, ainda vou analizar qual a nomenclatura correta

  @Column({ name: 'general_status', nullable: true, default: 'ATIVO' })
  generalStatus: string; 

  @CreateDateColumn({ name: 'registration_date' })
  registrationDate: Date;

  //RELACIONAMENTOS
  @OneToMany(() => DentalEvaluation, (evaluation) => evaluation.animal)
  dentalEvaluations: DentalEvaluation[]; 

  @OneToMany(() => Media, (media) => media.animal)
  mediaFiles: Media[]; //
}