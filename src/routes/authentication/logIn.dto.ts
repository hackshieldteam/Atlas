import { IsOptional, IsString, ValidateNested } from 'class-validator';

class CreateUserDto {
  @IsString()
  public name: string;

  @IsString()
  public password: string;

}

export default CreateUserDto;