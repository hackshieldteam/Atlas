import {Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, OneToMany, ManyToOne, ManyToMany, Index} from "typeorm";
import Asset from "./asset.entity";
import Area from "./area.entity";
import { IsOptional, ValidateNested, IsDate, IsDefined, IsString, IsArray } from "class-validator";
import Company from "./company.entity";
import { Type } from "class-transformer";

@Entity()
@Index(["name","company"],{unique : true})
class Department{

    @IsDefined()
    @PrimaryGeneratedColumn()
    id : number;

    @IsString()
    @Column("varchar",{ length : 20})
    name : string;

    @ValidateNested({
        each : true
    })
    @IsArray()
    @Type(()=> Asset)
    @OneToMany( () => Asset, asset => asset.department )
    assets : Asset[]

    @ValidateNested({
        each : true
    })
    @Type(()=> Area)
    @IsArray()
    @ManyToOne( () => Area, area => area.departments)
    area : Area;

    @ValidateNested({
        each : true
    })
    @Type(()=> Company)
    @IsArray()
    @ManyToOne(() => Company, company => company.departments, { nullable : false, onDelete : "CASCADE"})
    company : Company;

}

export default Department;
