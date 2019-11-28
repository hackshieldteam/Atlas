import { IsString, IsOptional, IsDefined, IsInt, IsNotEmpty } from 'class-validator';

class CreateCompanyDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  public description: string;

}

class UpdateCompanyDto {
  @IsOptional()
  @IsString()
  public name: string;

  @IsOptional()
  @IsString()
  public description: string;

}

class FindCompanyDto{
  @IsOptional()
  @IsString()
  public name: string;

  @IsOptional()
  @IsString()
  public description: string;
}

export {
  UpdateCompanyDto,
  CreateCompanyDto,
  FindCompanyDto
}