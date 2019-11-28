import { IsString, IsNumber, IsOptional, IsArray, ValidateNested, IsDefined, IsNotEmpty } from 'class-validator';
import Functionality from '../functionalities/functionality.entity';
import Company from '../companies/company.entity';
import { Type } from 'class-transformer';
 
class CreateProfileDto {

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  public name: string;
 
  @IsOptional()
  @ValidateNested({
    each : true
  })
  @IsArray()
  @Type(() => Functionality) 
  public functionalities : Functionality[]
 
  }


  class FindProfileDto {

    @IsOptional()
    @IsString()
    public name: string;
   
    @IsOptional()
    @ValidateNested({
      each : true
    })
    @IsArray()
    @Type(() => Functionality) 
    public functionalities : Functionality[]
   
    }
  class UpdateProfileDto {
    
    @IsOptional()
    @IsString()
    public name: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({
      each : true
    })
    @Type(() => Functionality) 
    public functionalities : Functionality[]
   
   
    }


export {
  UpdateProfileDto,
  CreateProfileDto,
  FindProfileDto
}