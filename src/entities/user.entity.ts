import {Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, OneToMany, ManyToOne, ManyToMany, Index} from "typeorm";
import  Profile  from './profile.entity'
import Group from "./group.entity";
import Company from "./company.entity";
import { IsInt, IsString, IsOptional, ValidateNested, IsDefined, IsArray } from "class-validator";
import { Type } from "class-transformer";
import Test_Instance from "./test_instance.entity";

@Entity()
class User{

    @IsDefined()
    @IsInt()
    @PrimaryGeneratedColumn()
    id : number;

    @IsString()
    @Column("varchar",{ length: 20 , unique : true})
    name : string;
    
    @IsString()
    @Column("char",{ length : 60, select : false})
    password : string;

    @ValidateNested()
    @Type(() => Profile)
    @ManyToOne(() => Profile, (profile : Profile) => profile.users, { onDelete : "SET NULL"})
    profile : Profile

    @ValidateNested({
        each : true
    })
    @IsArray()
    @Type(()=> Group)
    @ManyToMany(type => Group, group => group.users )
    groups : Group[]

    @ValidateNested({
        each : true
    })
    @IsArray()
    @Type(()=> Company)
    @ManyToMany(type => Company, company => company.users)
    companies : Company[];


    @ValidateNested({
        each : true
    })
    @IsArray()
    @Type(()=> Test_Instance)
    @OneToMany(type => Test_Instance, (test : Test_Instance) => test.user)
    tests : Test_Instance[] 
}

export default User;
