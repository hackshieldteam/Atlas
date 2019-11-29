import { IsString, IsOptional, IsInt, ValidateNested, IsDefined } from 'class-validator';
import Area from '../../entities/area.entity';
import Company from '../../entities/company.entity';
import { Type } from 'class-transformer';

class CreateDepartmentDto {
    @IsDefined()
    @IsString()
    public name: string;

    @IsDefined()
    @ValidateNested()
    @Type(()=> Area)
    public area : Area;

    @IsDefined()
    @ValidateNested()
    @Type(()=> Company)
    public company : Company
}
class FindDepartmentDto {
    @IsOptional()
    @IsString()
    public name: string;

    @IsOptional()
    @ValidateNested()
    @Type(()=> Area)
    public area : Area;

    @IsDefined()
    @ValidateNested()
    @Type(()=> Company)
    public company : Company
}

class UpdateDepartmentDto {
    @IsString()
    public name: string;
}

export {
    UpdateDepartmentDto,
    CreateDepartmentDto,
    FindDepartmentDto
}
