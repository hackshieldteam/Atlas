import { IsString, IsOptional, IsInt, ValidateNested, IsDefined, IsArray } from 'class-validator';
import Company from '../../entities/company.entity';
import { Type } from 'class-transformer';

class CreateKnowledgeDto {
    @IsDefined()
    @IsString()
    public name: string;

    @IsDefined()
    @IsString()
    public category: string;

    @IsDefined()
    @IsString()
    public content: string;
}



class UpdateKnowledgeDto {
    @IsOptional()
    @IsString()
    public name: string;

    @IsOptional()
    @IsString()
    public category: string;

    @IsOptional()
    @IsString()
    public content: string;
}

class FindKnowledgeDto {
    @IsOptional()
    @IsString()
    public name: string;
}

export {
    UpdateKnowledgeDto,
    CreateKnowledgeDto,
    FindKnowledgeDto
}
