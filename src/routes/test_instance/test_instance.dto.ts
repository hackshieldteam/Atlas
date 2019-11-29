import { IsString, IsOptional, IsInt, ValidateNested, IsDefined, IsArray } from 'class-validator';
import Company from '../../entities/company.entity';
import { Type } from 'class-transformer';
import User from 'entities/user.entity';
import Evidence from 'entities/evidence.entity';
import Test from 'entities/test.entity';
import Audit from 'entities/audit.entity';

class CreateTestInstanceDto {
    @IsDefined()
    @Type(() => User)
    @ValidateNested()
    public user: User;

    @IsDefined()
    @ValidateNested()
    @Type(() => Company)
    public company: Company;

    @IsDefined()
    @ValidateNested()
    @Type(() => Audit)
    public audit: Audit;

    @IsDefined()
    @IsString()
    date: string;

    @IsDefined()
    @IsString()
    description : string

    @IsOptional()
    @ValidateNested({
        each : true
    })
    @Type(()=> Evidence)
    evidences : Evidence[]


    @IsDefined()
    @ValidateNested()
    @Type(() => Test)
    public test: Test;
}



class UpdateTestInstanceDto {
    @IsOptional()
    @Type(() => User)
    @ValidateNested()
    public user: User;



    @IsOptional()
    @IsString()
    date: string;

    @IsOptional()
    @IsString()
    description : string

    @IsOptional()
    @ValidateNested({
        each : true
    })
    @Type(()=> Evidence)
    evidences : Evidence[]

}

class FindTestInstanceDto {
    @IsOptional()
    @Type(() => User)
    @ValidateNested()
    public user: User;

    @IsOptional()
    @IsString()
    date: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => Audit)
    public audit: Audit;

    @IsOptional()
    @Type(() => Company)
    @ValidateNested()
    public company: Company;
}

export {
    UpdateTestInstanceDto,
    CreateTestInstanceDto,
    FindTestInstanceDto
}
