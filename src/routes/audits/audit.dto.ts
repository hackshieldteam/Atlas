import { IsString, IsOptional, IsInt, ValidateIf, IsNotEmpty, IsDateString, IsArray, ValidateNested, IsDefined } from 'class-validator';
import Url from '../../entities/url.entity';
import Asset from '../../entities/asset.entity';
import Company from '../../entities/company.entity';
import { Type } from 'class-transformer';
import { CreateUrlDto } from '../urls/url.dto';


class CreateAuditDto {
    
    
    @IsOptional()
    @IsInt()
    public delivered: number;
    
    @IsOptional()
    @IsString()
    public kind: string;
    
    @ValidateIf( audit => audit.scheduled === null && audit.status == 0)
    @IsNotEmpty()
    @IsString()
    public launched : string;
    
    @IsDefined()
    @IsInt()
    public methodology: number;
    
    @IsDefined()
    @IsString()
    public name: string;

    @IsOptional()
    @IsString()
    public notes: string;



    @ValidateIf( audit => audit.launched === null && audit.status == 0)
    @IsNotEmpty()
    @IsString()
    public scheduled : string;

    @IsOptional()
    @IsInt()
    public status: number;

    @IsOptional()
    @IsString()
    public tool : string;

    @IsOptional()
    @ValidateNested()
    @Type(()=> Url)
    public url : Url;

    @IsDefined()
    @ValidateNested()
    @Type(()=> Asset)
    public asset  : Asset;

    @IsDefined()
    @ValidateNested()
    @Type(()=> Company)
    public company  : Company;

}

class FindAuditDto {
    
    @IsOptional()
    @IsString()
    public kind: string;
    
    @IsOptional()
    @IsInt()
    public delivered: number;
    
    @IsOptional()
    @ValidateIf( audit => audit.scheduled === null && audit.status == 0)
    @IsNotEmpty()
    @IsString()
    public launched : string;
    
    @IsOptional()
    @IsInt()
    public methodology: number;
    
    @IsOptional()
    @IsString()
    public name: string;

    @IsOptional()
    @IsString()
    public notes: string;

    @IsOptional()
    @ValidateIf( audit => audit.launched === null && audit.status == 0)
    @IsNotEmpty()
    @IsString()
    public scheduled : string;

    @IsOptional()
    @IsInt()
    public status: number;

    @IsOptional()
    @IsString()
    public tool : string;

    @IsOptional()
    @ValidateNested()
    @Type(()=> CreateUrlDto)
    public url : CreateUrlDto;

    @IsOptional()
    @ValidateNested()
    @Type(()=> Asset)
    public asset  : Asset;

    @IsOptional()
    @ValidateNested()
    @Type(()=> Company)
    public company : Company

}

class UpdateAuditDto {
    
    
    @IsOptional()
    @IsInt()
    public delivered: number;
    
    @IsOptional()
    @IsString()
    public kind: string;
    
    @IsOptional()
    @IsInt()
    public methodology: number;
    
    @IsOptional()
    @IsString()
    public name: string;
    
    @IsOptional()
    @IsString()
    public notes: string;

    @ValidateIf( audit => audit.launched === null && audit.status == 0)
    @IsNotEmpty()
    @IsString()
    public scheduled : string;

    @IsOptional()
    @IsInt()
    public status: number;

    @IsOptional()
    @IsString()
    public tool : string;

}

export {
    UpdateAuditDto,
    CreateAuditDto,
    FindAuditDto
}
