import {Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, OneToMany, ManyToMany} from "typeorm";
import  Profile  from "./profile.entity";
import { IsString, IsOptional } from "class-validator";

@Entity()
class Functionality{

    @IsString()
    @PrimaryColumn("varchar",{length : 50})
    name : string;

    @IsOptional()
    @ManyToMany(type => Profile, profile => profile.functionalities)
    profiles : Profile[];
}

export default Functionality;
