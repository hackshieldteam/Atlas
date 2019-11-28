import {Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, OneToMany, ManyToOne, ManyToMany} from "typeorm";
import Asset from "../assets/asset.entity";
import Audit from "../audits/audit.entity";
import { IsInt, IsOptional, IsString, ValidateNested, IsDefined, IsArray } from "class-validator";
import { Type } from "class-transformer";
import Company from "../companies/company.entity";

@Entity()
class Url{

    @IsDefined()
    @IsInt()
    @PrimaryGeneratedColumn()
    id : number;

    @IsInt()
    @Column({ type : "smallint" })
    kind : number;

    @IsString()
    @Column("varchar",{ length : 20})
    enviroment : string;

    @IsInt()
    @Column({ type : "smallint"})
    port : number;


    @IsString()
    @Column("varchar",{ length : 250, unique : true})
    url : string;

    @ValidateNested()
    @Type(()=>Asset)
    @ManyToOne(() => Asset, (asset : Asset) => asset.urls, { onDelete : "CASCADE"})
    asset : Asset

    @ValidateNested({
        each : true
    })
    @IsArray()
    @Type(()=>Audit)
    @OneToMany(() => Audit, (audit : Audit) => audit.url)
    audits : Audit[];

    @ValidateNested()
    @Type(()=>Company)
    @ManyToOne(()=> Company, (company : Company) => company.urls, { onDelete : "CASCADE"})
    company : Company
}

export default Url;