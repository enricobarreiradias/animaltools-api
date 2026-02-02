import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn,
  OneToMany //Para o relacionamento
} from 'typeorm';
//Para o relacionamento N:1
import { DentalEvaluation } from './dental-evaluation.entity'; //Criada dentro dessa mesma pasta

@Entity('user') 
export class User {
  @PrimaryGeneratedColumn('uuid') 
  id: string;

  @Column({ name: 'full_name' }) 
  fullName: string; 

  @Column({ unique: true }) 
  email: string;

  @CreateDateColumn({ name: 'registration_date' })
  registrationDate: Date; 

  // Um usuário (avaliador) pode ter feito N avaliações.
  @OneToMany(() => DentalEvaluation, (evaluation) => evaluation.evaluator)
  dentalEvaluations: DentalEvaluation[]; 
}