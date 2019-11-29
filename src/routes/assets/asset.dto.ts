import { IsString, IsOptional, IsInt, IsDateString, IsNumber, ValidateNested, IsArray, Validate, IsIn, IsDefined, IsNotEmpty } from 'class-validator';
import { isString, isNumber, isObject } from 'util';
import Integration from '../../entities/integration.entity';
import Tag from '../../entities/tag.entity';
import Group from '../../entities/group.entity';
import Audit from '../../entities/audit.entity';
import Url from '../../entities/url.entity';
import Department from '../../entities/department.entity';
import Area from '../../entities/area.entity';
import Company from '../../entities/company.entity';
import { Type } from 'class-transformer';
import { CreateUrlDto } from '../urls/url.dto';


class CreateAssetDto {

    @IsOptional()
    @IsString()
    public alias : string;

    @IsOptional()
    @IsInt()
    public authentication : number;
    
    @IsOptional()
    @IsInt()
    public authorization : number;

    @IsOptional()
    @IsInt()
    public availability : number;
      
    @IsOptional()
    @IsInt()
    public confidenciality : number;
    
    @IsOptional()
    @IsString()
    public description : string;
    
    @IsDefined()
    @IsInt()
    public enviroment : number;
    
    @IsOptional()
    @IsString()
    public hgf : string;
    
    @IsOptional()
    @IsInt()
    public integrity : number;
    
    @IsDefined()
    @IsInt()
    public kind : number;
  
    
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    public name : string;

    @IsDefined()
    @IsInt()
    public status : number;

    @IsOptional()
    @IsString()
    public statusDate : string;

    @IsOptional()
    @IsInt()
    public trazability : number;

    @IsDefined()
    @IsInt()
    public visibility : number;

    @IsOptional()
    @IsInt()
    public volumetry : number;

    @IsOptional()
    @ValidateNested()
    @Type(()=> Area)
    public businessArea : Area;

    @IsOptional()
    @IsArray()
    @ValidateNested({
        each : true
    })
    @Type(()=> Integration)
    public integrations : Integration[]

    @IsDefined()
    @ValidateNested()
    @Type(()=> Company)
    public company : Company

    @IsOptional()
    @ValidateNested()
    @Type(()=> Department)
    public department : Department;
    
    @IsOptional()
    @IsArray()
    @ValidateNested({
        each : true
    })
    @Type(()=> Tag)
    public tags : Tag[]

    @IsOptional()
    @IsArray()
    @ValidateNested({
        each : true
    })
    @Type(()=> Url)
    public urls : Url[]

    @IsOptional()
    @IsArray()
    @ValidateNested({
        each : true
    })
    @Type(()=> Group)
    public groups : Group[]
}

class UpdateAssetDto {
    @IsOptional()
    @IsString()
    public alias : string;

    
    @IsOptional()
    @IsInt()
    public authentication : number;
    
    @IsOptional()
    @IsInt()
    public authorization : number;
    
    @IsOptional()
    @IsInt()
    public availability : number;
    
    
    @IsOptional()
    @IsInt()
    public confidenciality : number;
    
    @IsOptional()
    @IsString()
    public description : string;
    
    @IsOptional()
    @IsInt()
    public enviroment : number;
    
    @IsOptional()
    @IsString()
    public hgf : string;
    
    @IsOptional()
    @IsInt()
    public integrity : number;

    @IsOptional()
    @IsInt()
    public kind : number;
    
    @IsOptional()
    @IsInt()
    public location : number;
    
    @IsOptional()
    @IsString()
    public name : string;

    @IsOptional()
    @IsInt()
    public status : number;

    @IsOptional()
    @IsString()
    public statusDate : string;

    @IsOptional()
    @IsInt()
    public trazability : number;

    @IsOptional()
    @IsInt()
    public visibility : number;

    @IsOptional()
    @IsInt()
    public volumetry : number;

    @IsOptional()
    @ValidateNested()
    @Type(()=> Area)
    public businessArea : Area;

    @IsOptional()
    @IsArray()
    @ValidateNested({
        each : true
    })
    @Type(()=> Integration)
    public integrations : Integration[]



    @IsOptional()
    @ValidateNested()
    @Type(()=> Department)
    public department : Department;
    
    @IsOptional()
    @IsArray()
    @ValidateNested({
        each : true
    })
    @Type(()=> Tag)
    public tags : Tag[]

    @IsOptional()
    @IsArray()
    @ValidateNested({
        each : true
    })
    @Type(()=> Url)
    public urls : Url[]

    @IsOptional()
    @IsArray()
    @ValidateNested({
        each : true
    })
    @Type(()=> Group)
    public groups : Group[]
}

class FindAssetDto{
    @IsOptional()
    @IsString()
    public alias : string;

    @IsOptional()
    @IsInt()
    public authentication : number;
    
    @IsOptional()
    @IsInt()
    public authorization : number;
    
    @IsOptional()
    @IsInt()
    public availability : number;
    
    @IsOptional()
    @IsInt()
    public kind : number;

    @IsOptional()
    @IsInt()
    public confidenciality : number;

    @IsOptional()
    @IsString()
    public description : string;

    @IsOptional()
    @IsInt()
    public enviroment : number;

    @IsOptional()
    @IsString()
    public hgf : string;

    @IsOptional()
    @IsInt()
    public integrity : number;

    @IsOptional()
    @IsInt()
    public location : number;

    @IsOptional()
    @IsString()
    public name : string;

    @IsOptional()
    @IsInt()
    public status : number;

    @IsOptional()
    @IsString()
    public statusDate : string;

    @IsOptional()
    @IsInt()
    public trazability : number;

    @IsOptional()
    @IsInt()
    public visibility : number;

    @IsOptional()
    @IsInt()
    public volumetry : number;

    @IsOptional()
    @ValidateNested()
    @Type(()=> Area)
    public businessArea : Area;


    @IsOptional()
    @ValidateNested()
    @Type(()=> Company)
    public company : Company

    @IsOptional()
    @ValidateNested()
    @Type(()=> Department)
    public department : Department;
    
    @IsOptional()
    @IsArray()
    @ValidateNested({
        each : true
    })
    @Type(()=> Tag)
    public tags : Tag[]

    @IsOptional()
    @IsArray()
    @ValidateNested({
        each : true
    })
    @Type(()=> CreateUrlDto)
    public urls : CreateUrlDto[]

    @IsOptional()
    @IsArray()
    @ValidateNested({
        each : true
    })
    @Type(()=> Group)
    public groups : Group[]
}

export {
    UpdateAssetDto,
    CreateAssetDto,
    FindAssetDto
}
