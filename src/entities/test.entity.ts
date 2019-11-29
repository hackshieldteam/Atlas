import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import { IsDefined, IsString, ValidateNested, IsArray } from "class-validator";
import Methodology from "./methodology.entity";
import User from "./user.entity";
import { Type } from "class-transformer";
import Company from "./company.entity";
import Test_Instance from "./test_instance.entity";



@Entity()
class Test{

@IsDefined()
@PrimaryGeneratedColumn()
id! : number;

@IsString()
@Column("varchar", { length : 50})
name : string

@IsString()
@Column("text")
description : string


@ValidateNested()
@Type(() => Methodology)
@ManyToMany(type => Methodology, (methodology : Methodology) => methodology.tests)
methodologies : Methodology[]

@ValidateNested({
    each : true
})
@IsArray()
@OneToMany(type => Test_Instance, test_instance => test_instance.company)
instances : Test_Instance[]



@ValidateNested()
@Type(() => Company)
@ManyToOne( type => Company, (company : Company) => company.assets)
public company : Company;




}


export default Test;
