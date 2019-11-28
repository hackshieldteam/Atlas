import { IsString, IsNumber, IsOptional, IsArray, ValidateNested, IsDefined } from 'class-validator';
import Functionality from '../functionalities/functionality.entity';
import Company from '../companies/company.entity';
import { Type } from 'class-transformer';
 
class CreateTagDto {
  @IsDefined()
  @IsString()
  public name: string;
 
  @IsDefined()
    @ValidateNested()
    @Type(()=> Company)
    public company : Company;

  }

  class FindTagDto {
    @IsDefined()
    @IsString()
    public name: string;
   
    @IsDefined()
      @ValidateNested()
      @Type(()=> Company)
      public company : Company;
  
    }
  class UpdateTagDto {
    
    @IsDefined()
    @IsString()
    public name: string;

   
    }


export {
  UpdateTagDto,
  CreateTagDto,
  FindTagDto
}