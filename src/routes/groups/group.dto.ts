import { IsString, IsNumber, IsOptional, IsArray, IsInt, ValidateNested, IsDefined } from 'class-validator';
import Functionality from '../../entities/functionality.entity';
import User from '../../entities/user.entity';
import Company from '../../entities/company.entity';
import { Type } from 'class-transformer';

class CreateGroupDto {
  @IsDefined()
  @IsString()
  public name: string;

  @IsDefined()
  @ValidateNested()
  @Type(()=> Company)
  public company : Company;

  @IsOptional()
  @IsArray()
  @ValidateNested({
    each : true
  })
  @Type(() => User)
  public users : User[]

}

class FindGroupDto {
  @IsOptional()
  @IsString()
  public name: string;

  @IsOptional()
  @ValidateNested()
  @Type(()=> Company)
  public company : Company;

}

class UpdateGroupDto {

  @IsOptional()
  @IsString()
  public name: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({
    each : true
  })
  @Type(() => User)
  public users : User[]

}


export {
  UpdateGroupDto,
  CreateGroupDto,
  FindGroupDto
}
