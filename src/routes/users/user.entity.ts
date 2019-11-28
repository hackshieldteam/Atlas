import {Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, OneToMany, ManyToOne, ManyToMany, Index} from "typeorm";
import  Profile  from '../profiles/profile.entity'
import Group from "../groups/group.entity";
import Company from "../companies/company.entity";
import { IsInt, IsString, IsOptional, ValidateNested, IsDefined, IsArray } from "class-validator";
import { Type } from "class-transformer";
import Test from "../tests/test.entity";

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
    @Type(()=> Test)
    @OneToMany(type => Test, (test : Test) => test.user)
    tests : Test[] 
}

export default User;