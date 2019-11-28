import {Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable, ManyToOne, Index} from "typeorm";
import  User  from "../users/user.entity";
import Company from "../companies/company.entity";
import Asset from "../assets/asset.entity";
import Tag from "../tags/tag.entity";
import { IsInt, IsOptional, ValidateNested, IsDefined, IsArray } from "class-validator";
import { Type } from "class-transformer";

@Entity()
@Index(["name","company"],{unique : true})
class Group{

    @IsDefined()
    @IsInt()
    @PrimaryGeneratedColumn()
    id : number;
    
    @IsOptional()
    @Column("varchar",{ length : 50})
    name : string;

    @ValidateNested({
        each : true
    })
    @IsArray()
    @ManyToMany(type => User, user => user.groups)
    @Type(()=> User)
    @JoinTable()
    users : User[];

    @ValidateNested({
        each : true
    })
    @IsArray()
    @ManyToMany(type => Asset, asset => asset.groups)
    @Type(()=> Asset)
    @JoinTable()
    assets : Asset[];

    @ValidateNested({
        each : true
    })
    @IsArray()
    @ManyToMany(type => Tag, tag => tag.groups)
    @Type(()=> Tag)
    @JoinTable()
    tags : Tag[];

    @ValidateNested()
    @Type(()=> Company)
    @ManyToOne(type => Company, company => company.groups)
    company : Company;
}

export default Group;