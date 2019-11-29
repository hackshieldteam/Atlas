import { IsString, IsOptional, IsInt, ValidateNested, IsDefined } from 'class-validator';
import { isObject } from 'util';
import Asset from '../../entities/asset.entity';
import { Type } from 'class-transformer';
import Company from '../../entities/company.entity';


class CreateIntegrationDto {
    @IsDefined()
    @IsString()
    public name: string;

    @IsOptional()
    @IsInt()
    public kind : number;

    @IsOptional()
    @IsString()
    public comment : string;

    @IsOptional()
    @IsInt()
    public ndone : number;

    @IsOptional()
    @IsInt()
    public ntotal : number;

    @IsOptional()
    @IsString()
    public papDate;

    @IsOptional()
    @IsInt()
    public status : number;

    @IsOptional()
    @IsString()
    public startDate;

    @IsDefined()
    @ValidateNested()
    @Type(()=> Asset)
    public asset : Asset;
}


class FindIntegrationDto {
    @IsOptional()
    @IsString()
    public name: string;

    @IsOptional()
    @IsInt()
    public kind : number;

    @IsOptional()
    @IsString()
    public comment : string;

    @IsOptional()
    @IsInt()
    public ndone : number;

    @IsOptional()
    @IsInt()
    public ntotal : number;

    @IsOptional()
    @IsString()
    public papDate;

    @IsOptional()
    @IsInt()
    public status : number;

    @IsOptional()
    @IsString()
    public startDate;

    @IsOptional()
    @ValidateNested()
    @Type(()=> Asset)
    public asset : Asset;

    @IsDefined()
    @ValidateNested()
    @Type(()=> Company)
    public company : Company;
}

class UpdateIntegrationDto {
    
    
    @IsOptional()
    @IsString()
    public comment : string;
    
    @IsOptional()
    @IsInt()
    public kind : number;
    
    @IsOptional()
    @IsString()
    public name: string;
    
    @IsOptional()
    @IsInt()
    public ndone : number;

    @IsOptional()
    @IsInt()
    public ntotal : number;

    @IsOptional()
    @IsString()
    public papDate;

    @IsOptional()
    @IsInt()
    public status : number;

    @IsOptional()
    @IsString()
    public startDate;
}

export {
    UpdateIntegrationDto,
    CreateIntegrationDto,
    FindIntegrationDto
}
