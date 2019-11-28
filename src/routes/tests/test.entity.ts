import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne } from "typeorm";
import { IsDefined, IsString, ValidateNested } from "class-validator";
import Methodology from "../methodologies/methodology.entity";
import User from "../users/user.entity";
import { Type } from "class-transformer";
import Company from "../companies/company.entity";



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
@Type(() => User)
@ManyToOne(type => User, (user : User) => user.tests)
user : User;

@ValidateNested()
@Type(() => Methodology)
@ManyToOne(type => Methodology, (methodology : Methodology) => methodology.tests)
methodology : Methodology


@ValidateNested()
@Type(() => Company)
@ManyToOne( type => Company, (company : Company) => company.assets)
public company : Company;




}


export default Test;