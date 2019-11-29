import { IsString, IsNumber, IsOptional, ValidateNested, IsInt, IsArray, IsDefined } from 'class-validator';
import Profile from '../../entities/profile.entity';
import { Type } from 'class-transformer';
import Company from '../../entities/company.entity';
import Group from '../../entities/group.entity';
 
class CreateUserDto {
 
  @IsDefined()
  @IsString()
  public name: string;

  @IsDefined()
  @IsString()
  public password: string;

  @IsDefined()
  @ValidateNested()
  @Type(()=> Profile)
  public profile: Profile;

  @IsDefined()
  @ValidateNested({
    each : true
  })
  @IsArray()
  @Type(()=> Company)
  public companies : Company[]

  @IsOptional()
  @ValidateNested({
    each : true
  })
  @Type(() => Group)
  public groups : Group[]
  
 
  }

  class FindUserDto {
    
  
    @IsOptional()
    @IsString()
    public name: string;
   
    @IsOptional()
    @IsString()
    public password: string;
    
    @IsOptional()
    @ValidateNested()
    @Type(()=> Profile)
    public profile: number;
   
    @IsOptional()
    @IsArray()
    @ValidateNested({
      each : true
    })
    @Type(()=> Company)
    public companies : Company[]

    }


  class UpdateUserDto {
    
  
    @IsOptional()
    @IsString()
    public name: string;
   
    @IsOptional()
    @IsString()
    public password: string;
    
    @IsOptional()
    @ValidateNested()
    @Type(()=> Profile)
    public profile: number;

    @IsOptional()
    @IsArray()
    @ValidateNested({
      each : true
    })
    @Type(()=> Company)
    public companies: Company[];
   
    }


export {
  UpdateUserDto,
  CreateUserDto,
  FindUserDto
}
