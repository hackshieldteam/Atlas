import { IsString, IsNumber, IsOptional, IsArray, IsEmail, IsPhoneNumber, ValidateNested, IsDefined } from 'class-validator';
import Company from '../companies/company.entity';
import { Type } from 'class-transformer';

class CreateResponsableDto {
    @IsDefined()
    @IsString()
    public name: string;

    @IsDefined()
    @IsEmail()
    public email: string;

    @IsDefined()
    @IsPhoneNumber("ES")
    public tlf: string;

    @IsDefined()
    @ValidateNested()
    @Type(()=> Company)
    public company : Company

}

class FindResponsableDto {
    @IsOptional()
    @IsString()
    public name: string;

    @IsOptional()
    @IsEmail()
    public email: string;

    @IsOptional()
    @IsPhoneNumber("ES")
    public tlf: string;

    @IsDefined()
    @ValidateNested()
    @Type(()=> Company)
    public company : Company

}


class UpdateResponsableDto {

    @IsOptional()
    @IsString()
    public name: string;

    @IsOptional()
    @IsEmail()
    public email: string;

    @IsOptional()
    @IsPhoneNumber("ES")
    public tlf: string;


}


export {
    UpdateResponsableDto,
    CreateResponsableDto,
    FindResponsableDto,
}