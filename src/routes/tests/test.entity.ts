import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import { IsDefined, IsString, ValidateNested, IsArray } from "class-validator";
import Methodology from "../methodologies/methodology.entity";
import User from "../users/user.entity";
import { Type } from "class-transformer";
import Company from "../companies/company.entity";
import Test_Instance from "../test_instance/test_instance.entity";



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
@ManyToOne(type => Methodology, (methodology : Methodology) => methodology.tests)
methodology : Methodology

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