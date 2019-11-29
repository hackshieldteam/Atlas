import {Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, OneToMany, Unique, ManyToMany, JoinTable} from "typeorm";
import Group from "../groups/group.entity";
import Area from "../areas/area.entity";
import Asset from "../assets/asset.entity";
import User from "../users/user.entity";
import Url from "../urls/url.entity";
import { IsInt, IsString, IsOptional, ValidateNested, IsDefined, IsArray } from "class-validator";
import Audit from "../audits/audit.entity";
import Department from "../departments/department.entity";
import Profile from "../profiles/profile.entity";
import Responsable from "../responsables/responsable.entity";
import Tag from "../tags/tag.entity";
import { Type } from "class-transformer";
import Test from "../tests/test.entity";
import Methodology from "../methodologies/methodology.entity";
import Test_Instance from "../test_instance/test_instance.entity";

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


    @ValidateNested({
        each : true
    })
    @IsArray()
    @OneToMany( type => Test, test => test.company)
    test : Test[]

    @ValidateNested({
        each : true
    })
    @IsArray()
    @OneToMany(type => Test_Instance, test_instance => test_instance.company)
    test_instances : Test_Instance[]

    @ValidateNested({
        each : true
    })
    @IsArray()
    @OneToMany( type => Methodology, methodology => methodology.company)
    methodologies : Methodology[]



}

export default Company;