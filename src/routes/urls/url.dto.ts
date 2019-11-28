import { IsString, IsOptional, IsInt, ValidateNested, IsDefined } from 'class-validator';
import { isObject } from 'util';
import Asset from '../assets/asset.entity';
import { Type } from 'class-transformer';

class CreateUrlDto {

    @IsDefined()
    @IsString()
    public url: string;

    @IsDefined()
    @IsString()
    public enviroment: string;

    @IsDefined()
    @IsInt()
    public kind : number;

    @IsDefined()
    @IsInt()
    public port : number;

    @ValidateNested()
    @Type(()=> Asset)
    public asset : Asset;
}

class FindUrlDto {

    @IsOptional()
    @IsString()
    public url: string;

    @IsOptional()
    @IsString()
    public enviroment: string;

    @IsOptional()
    @IsInt()
    public kind : number;

    @IsOptional()
    @IsInt()
    public port : number;

    @ValidateNested()
    @Type(()=> Asset)
    public asset : Asset;
}

class UpdateUrlDto {
    @IsOptional()
    @IsString()
    public url: string;

    @IsOptional()
    @IsString()
    public enviroment: string;

    @IsOptional()
    @IsInt()
    public kind : number;

    @IsOptional()
    @IsInt()
    public port : number;
}

export {
    UpdateUrlDto,
    CreateUrlDto,
    FindUrlDto
}