import { IsString, IsOptional, IsInt, ValidateNested, IsDefined, IsArray } from 'class-validator';
import Tracking from '../../entities/tracking.entity';
import { Type } from 'class-transformer';
import Vulnerability from 'entities/vulnerability.entity';

class CreateTrackingDto {
    @IsDefined()
    @IsString()
    public key: string;

    @IsDefined()
    @Type(() => Vulnerability)
    @ValidateNested()
    public vulnerability: Vulnerability;
}

class FindTrackingDto {
    @IsOptional()
    @IsString()
    public key: string;

    @IsOptional()
    @Type(() => Vulnerability)
    @ValidateNested()
    public company: Vulnerability;
}

class UpdateTrackingDto {
    @IsDefined()
    @IsString()
    public status: string;

    @IsDefined()
    @IsString()
    public priority: string;

    @IsDefined()
    @IsString()
    public summary: string;

    @IsDefined()
    @IsString()
    public description: string;

}

export {
    UpdateTrackingDto,
    CreateTrackingDto,
    FindTrackingDto
}
