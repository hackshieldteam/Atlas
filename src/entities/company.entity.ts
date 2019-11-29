import {Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, OneToMany, Unique, ManyToMany, JoinTable} from "typeorm";
import Group from "./group.entity";
import Area from "./area.entity";
import Asset from "./asset.entity";
import User from "./user.entity";
import Url from "./url.entity";
import { IsInt, IsString, IsOptional, ValidateNested, IsDefined, IsArray } from "class-validator";
import Audit from "./audit.entity";
import Department from "./department.entity";
import Profile from "./profile.entity";
import Responsable from "./responsable.entity";
import Tag from "./tag.entity";
import { Type } from "class-transformer";
import Test from "./test.entity";
import Methodology from "./methodology.entity";
import Test_Instance from "./test_instance.entity";
import Credential from "./credentials.entity";

@Entity()
class Company{

    @IsDefined()
    @IsInt()
    @PrimaryGeneratedColumn()
    id : number;
    
    @IsString()
    @Column("varchar",{ length : 15 , unique : true})
    name : string;
    
    @IsString()
    @Column("text")
    description : string;

    @ValidateNested({
        each : true
    })
    @IsArray()
    @OneToMany(type => Group, group => group.company)
    @Type(()=> Group)
    @JoinTable()
    groups : Group[]

    @ValidateNested({
        each : true
    })
    @Type(()=> Area)
    @IsArray()
    @OneToMany( () => Area, area => area.company)
    areas : Area[];

    @ValidateNested({
        each : true
    })
    @IsArray()
    @OneToMany( () => Asset, asset => asset.company)
    assets : Asset[];

    @ValidateNested({
        each : true
    })
    @IsArray()
    @OneToMany( () => Audit, audit => audit.company)
    audits : Audit[];

    @ValidateNested({
        each : true
    })
    @IsArray()
    @OneToMany( () => Credential, credential => credential.company)
    credentials : Credential[];

    @ValidateNested({
        each : true
    })
    @IsArray()
    @ManyToMany( type => User, user => user.companies)
    @JoinTable()
    users : User[]

    @ValidateNested({
        each : true
    })
    @IsArray()
    @OneToMany( type => Department, department => department.company)
    departments : Department[]


    @ValidateNested({
        each : true
    })
    @IsArray()
    @OneToMany( type => Responsable, responsable => responsable.company)
    responsables : Responsable[]

    @ValidateNested({
        each : true
    })
    @IsArray()
    @OneToMany( type => Tag, tag => tag.company)
    tags : Tag[]

    @ValidateNested({
        each : true
    })
    @IsArray()
    @OneToMany( type => Url, url => url.company)
    urls : Url[]



}

export default Company;
