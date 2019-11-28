import { IsString, IsOptional, IsInt, ValidateNested, IsDefined, IsArray } from 'class-validator';
import Company from '../companies/company.entity';
import { Type } from 'class-transformer';

class CreateAreaDto {
    @IsDefined()
    @IsString()
    public name: string;

    @IsDefined()
    @Type(() => Company)
    @ValidateNested()
    public company: Company;
}



class UpdateAreaDto {
    @IsDefined()
    @IsString()
    public name: string;
}

class FindAreaDto {
    @IsOptional()
    @IsString()
    public name: string;

    @IsOptional()
    @Type(() => Company)
    @ValidateNested()
    public company: Company;
}

export {
    UpdateAreaDto,
    CreateAreaDto,
    FindAreaDto
}