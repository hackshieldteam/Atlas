import { IsString, IsOptional, IsInt, ValidateNested, IsDefined, IsArray } from 'class-validator';
import Company from '../../entities/company.entity';
import { Type } from 'class-transformer';

class CreateTestDto {
    @IsDefined()
    @IsString()
    public name: string;

    @IsDefined()
    @IsString()
    public description: string;
    
    @IsDefined()
    @Type(() => Company)
    @ValidateNested()
    public company: Company;
}



class UpdateTestDto {
    @IsOptional()
    @IsString()
    public name: string;

    @IsOptional()
    @IsString()
    public description: string;
}

class FindTestDto {
    @IsOptional()
    @IsString()
    public name: string;

    @IsOptional()
    @IsString()
    public description: string;

}

export {
    UpdateTestDto,
    CreateTestDto,
    FindTestDto
}
