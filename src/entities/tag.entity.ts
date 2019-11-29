import {Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable, ManyToOne, Index} from "typeorm";
import Asset from "./asset.entity";
import Company from "./company.entity";
import Group from "./group.entity";
import { IsString, ValidateNested, IsOptional, IsDefined, IsArray } from "class-validator";
import { Type } from "class-transformer";

@Entity()
@Index(["name","company"],{unique : true})
class Tag{

    @IsDefined()
    @IsString()
    @PrimaryColumn("varchar",{length : 20})
    name : string;

    @ValidateNested({
        each : true
    })
    @IsArray()
    @Type(()=>Asset)
    @ManyToMany(type => Asset, asset => asset.tags)
    assets : Asset[];


    @ValidateNested({
        each : true
    })
    @IsArray()
    @Type(()=>Group)
    @ManyToMany(type => Group, group => group.tags)
    groups : Group[];

    
    @ValidateNested()
    @Type(()=>Company)
    @ManyToOne(() => Company, company => company.tags, { nullable : false, onDelete : "CASCADE"})
    company : Company;


}

export default Tag;
