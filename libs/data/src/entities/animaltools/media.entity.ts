import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  ManyToMany, 
  JoinColumn, 
  CreateDateColumn 
} from 'typeorm';
import { Animal } from './animal.entity';
import { DentalEvaluation } from './dental-evaluation.entity';

// CORREÇÃO AQUI: Mudança para '../../enums/dental-evaluation.enums'
import { PhotoType } from '../../enums/dental-evaluation.enums';

@Entity('media') 
export class Media {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 's3_url_path', type: 'text' })
  s3UrlPath: string; // O caminho completo para o arquivo no AWS S3

  @Column({ 
    name: 'photo_type',
    type: 'simple-enum',
    enum: PhotoType,
    default: PhotoType.FRONTAL
  })
  photoType: PhotoType; // Tipo de foto (Frontal, Traseira)

  @CreateDateColumn({ name: 'upload_date' })
  uploadDate: Date; //

  //RELACIONAMENTOS

  //Arquivo de mídia pertence a um animal
  @ManyToOne(() => Animal, (animal) => animal.mediaFiles)
  @JoinColumn({ name: 'animal_id' })
  animal: Animal;
  
  @Column({ name: 'animal_id' })
  animalId: number; 

  //Uma foto pode ser anexada a várias avaliações,
  @ManyToMany(() => DentalEvaluation, (evaluation) => evaluation.mediaFiles)
  evaluations: DentalEvaluation[]; //
}