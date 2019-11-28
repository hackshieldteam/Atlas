import {Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, OneToMany, ManyToOne, ManyToMany, Index} from "typeorm";
import Asset from "../assets/asset.entity";
import ResponsableToAsset from "./responsabletoasset.entity";
import { IsInt, IsEmail, IsOptional, IsString, IsPhoneNumber, ValidateNested, IsDefined, IsArray } from "class-validator";
import Company from "../companies/company.entity";
import { Type } from "class-transformer";

@Entity()
@Index(["name","company"],{unique : true})
class Responsable{

    @IsDefined()
    @IsInt()
    @PrimaryGeneratedColumn()
    id : number;

    @IsEmail()
    @Column("varchar",{ length : 50 , unique : true})
    email : string;

    @IsString()
    @Column("varchar",{ length : 50, unique : true})
    name : string;

    @IsPhoneNumber("ES")
    @Column("varchar",{ length : 15 , unique : true})
    tlf : string;

    @ValidateNested({
        each : true
    })
    @IsArray()
    @Type(() => ResponsableToAsset)
    @OneToMany((type) => ResponsableToAsset, (responsableToAsset) => responsableToAsset.responsable)
    public assets! : ResponsableToAsset[]

    @ValidateNested()
    @Type(() => Company)
    @ManyToOne(() => Company, company => company.responsables, { nullable : false, onDelete : "CASCADE"})
    company : Company;

}

export default Responsable;