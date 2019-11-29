import { IsDate, IsDefined, IsString, ValidateNested, IsOptional, IsArray } from "class-validator";
import { Type } from "class-transformer";
import Company from "../../entities/company.entity";
import Test from "../../entities/test.entity";

class CreateMethodologyDto{
    @IsDefined()
    @IsString()
    public name : string


    @IsDefined()
    @Type(() => Company)
    @ValidateNested()
    public company: Company;

    @ValidateNested({
        each : true
    })
    @Type(() => Test)
    tests : Test[]
}

class UpdateMethodologyDto{
    @IsOptional()
    @IsString()
    public name : string
}


class FindMethodologyDto{
    @IsOptional()
    @IsString()
    public name : string
}

export{
    UpdateMethodologyDto,
    CreateMethodologyDto,
    FindMethodologyDto
}
