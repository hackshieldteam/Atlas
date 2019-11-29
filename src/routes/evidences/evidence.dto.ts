import { IsString, IsOptional, IsDefined, IsInt, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import Vulnerability from '../../entities/vulnerability.entity';
import Company from '../../entities/company.entity';

class CreateEvidenceDto {
  
    @IsDefined()
    @IsString()
    public description: string;

    @IsInt()
    public class: number;

    @IsDefined()
    public evidence : string

    @IsDefined()
    @ValidateNested()
    @Type(() => Vulnerability)
    public vulnerability : Vulnerability;


    @IsDefined()
    @ValidateNested()
    @Type(() => Company)
    public company : Company;
  
  }


  class UpdateEvidenceDto {
    @IsOptional()
    @IsString()
    public description: string;   
  }


  class FindEvidenceDto {

  }





export {
    UpdateEvidenceDto,
    CreateEvidenceDto,
    FindEvidenceDto
  }
