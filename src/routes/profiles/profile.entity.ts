import {Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable, ManyToOne, Index} from "typeorm";
import  Functionality  from "../functionalities/functionality.entity";
import  User  from "../users/user.entity";
import { IsInt, IsOptional, ValidateNested, IsDefined, IsString, IsArray } from "class-validator";
import Company from "../companies/company.entity";
import { Type } from "class-transformer";

@Entity()
class Profile{

    @IsDefined()
    @IsInt()
    @PrimaryGeneratedColumn()
    id : number;
    
    @IsString()
    @Column("varchar",{ length : 20, unique : true})
    name : string;

    @ValidateNested({
        each : true
      })
    @IsArray()
    @Type(() => User)
    @OneToMany(() => User , (user : User) => user.profile)
    users : User[];

    @ValidateNested({
        each : true
      })
      @IsArray()
    @Type(() => Functionality) 
    @ManyToMany(type => Functionality, functionality => functionality.profiles)
    @JoinTable()
    functionalities : Functionality[];

    

}

export default Profile;