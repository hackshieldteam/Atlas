import { IsDefined, IsString, IsOptional, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import Company from "../../entities/company.entity";



class CreateCredentialDto{
    @IsDefined()
    @IsString()
    public name : string

    @IsDefined()
    @IsString()
    public homePath : string

    @IsOptional()
    @IsString()
    public consumerKey : string

    @IsOptional()
    @IsString()
    public consumerPrivateKey : string

    @IsOptional()
    @IsString()
    public description : string

    @IsOptional()
    @IsString()
    public token : string

    @IsDefined()
    @Type(() => Company)
    @ValidateNested()
    public company: Company;

}

class FindCredentialDto{
    @IsOptional()
    @IsString()
    public name : string
}

class UpdateCredentialDto{
    @IsDefined()
    @IsString()
    public homePath : string

    @IsOptional()
    @IsString()
    public consumerKey : string

    @IsOptional()
    @IsString()
    public consumerPrivateKey : string

    @IsOptional()
    @IsString()
    public description : string

    @IsOptional()
    @IsString()
    public token : string
}

export{
    UpdateCredentialDto,
    CreateCredentialDto,
    FindCredentialDto
}
