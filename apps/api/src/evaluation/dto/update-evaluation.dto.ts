import {
  IsString,
  IsInt,
  IsArray,
  ValidateNested,
  IsOptional,
  IsEnum,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ToothType } from './create-evaluation.dto';

/** DTO for updating a single tooth: only toothCode is required (to identify the tooth). */
export class UpdateToothEvaluationDto {
  @Transform(({ value }) => (value == null ? value : String(value)))
  @IsString()
  toothCode: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  id?: number;

  @Transform(({ value }) =>
    value === true || value === "true"
      ? true
      : value === false || value === "false"
        ? false
        : value,
  )
  @IsBoolean()
  @IsOptional()
  isPresent?: boolean;

  @IsEnum(ToothType)
  @IsOptional()
  toothType?: ToothType;

  @IsInt()
  @Min(0)
  @Max(2)
  @IsOptional()
  @Type(() => Number)
  fractureLevel?: number;

  @IsInt()
  @Min(0)
  @Max(2)
  @IsOptional()
  @Type(() => Number)
  pulpitis?: number;

  @IsInt()
  @Min(0)
  @Max(2)
  @IsOptional()
  @Type(() => Number)
  gingivalRecessionLevel?: number;

  @IsInt()
  @Min(0)
  @Max(2)
  @IsOptional()
  @Type(() => Number)
  crownReductionLevel?: number;

  @IsInt()
  @Min(0)
  @Max(2)
  @IsOptional()
  @Type(() => Number)
  lingualWear?: number;

  @IsInt()
  @Min(0)
  @Max(2)
  @IsOptional()
  @Type(() => Number)
  periodontalLesions?: number;

  @IsInt()
  @Min(0)
  @Max(2)
  @IsOptional()
  @Type(() => Number)
  dentalCalculus?: number;

  @IsInt()
  @Min(0)
  @Max(2)
  @IsOptional()
  @Type(() => Number)
  caries?: number;

  @IsInt()
  @Min(0)
  @Max(1)
  @IsOptional()
  @Type(() => Number)
  gingivitisColor?: number;

  @IsInt()
  @Min(0)
  @Max(1)
  @IsOptional()
  @Type(() => Number)
  abnormalColor?: number;

  @IsInt()
  @Min(0)
  @Max(2)
  @IsOptional()
  @Type(() => Number)
  vitrifiedBorder?: number;

  @IsInt()
  @Min(0)
  @Max(2)
  @IsOptional()
  @Type(() => Number)
  pulpChamberExposure?: number;

  @IsInt()
  @Min(0)
  @Max(2)
  @IsOptional()
  @Type(() => Number)
  gingivitisEdema?: number;
}

export class UpdateEvaluationDto {
  @IsString()
  @IsOptional()
  notes?: string;

  /** Alias some frontends send instead of notes */
  @IsString()
  @IsOptional()
  generalObservations?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateToothEvaluationDto)
  @IsOptional()
  teeth?: UpdateToothEvaluationDto[];

  /** Allowed so request body is not rejected; not used on update */
  @IsOptional()
  @IsString()
  animalId?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  evaluatorId?: number;
}
