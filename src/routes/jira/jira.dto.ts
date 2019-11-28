import { IsString, IsOptional, IsDefined, IsInt, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import Vulnerability from '../vulnerabilities/vulnerability.entity';
import Company from '../companies/company.entity';

class CreateJiraDto {
  
    @IsDefined()
    @IsString()
    public name: string;

    @IsOptional()
    @IsString()
    public homePath: string;

    @IsOptional()
    @IsString()
    public consumerKey: string;

    @IsOptional()
    @IsString()
    public consumerPrivateKeyPath: string;

    @IsDefined()
    @IsString()
    public accessToken: string;

    @IsDefined()
    @IsString()
    public description: string;

    @IsDefined()
    @ValidateNested()
    @Type(() => Company)
    public company : Company;
  
  }


  class UpdateJiraDto {

    @IsOptional()
    @IsString()
    public name: string;

    @IsOptional()
    @IsString()
    public homePath: string;

    @IsOptional()
    @IsString()
    public consumerKey: string;

    @IsOptional()
    @IsString()
    public consumerPrivateKeyPath: string;

    @IsOptional()
    @IsString()
    public accessToken: string;

    @IsOptional()
    @IsString()
    public description: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => Company)
    public company : Company;
    
  }


  class FindJiraDto {

    @IsOptional()
    @IsString()
    public name: string;

    @IsOptional()
    @IsString()
    public homePath: string;

    @IsOptional()
    @IsString()
    public consumerKey: string;

    @IsOptional()
    @IsString()
    public consumerPrivateKeyPath: string;
    
    @IsOptional()
    @IsString()
    public accessToken: string;

    @IsOptional()
    @IsString()
    public description: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => Company)
    public company : Company;

  }





export {
    UpdateJiraDto,
    CreateJiraDto,
    FindJiraDto
  }