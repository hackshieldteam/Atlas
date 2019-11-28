import {Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, OneToMany, ManyToOne, ManyToMany, Index} from "typeorm";
import Asset from "../assets/asset.entity";
import Url from "../urls/url.entity";
import Vulnerability from "../vulnerabilities/vulnerability.entity";
import { IsInt, IsOptional, ValidateNested, IsDefined, IsString, IsNumber } from "class-validator";
import Company from "../companies/company.entity";
import { isString } from "util";
import { Type } from "class-transformer";

@Entity()
@Index(["name","company"],{unique : true})
class Audit{

    @IsDefined()
    @IsInt()
    @PrimaryGeneratedColumn()
    id : number;

    @IsString()
    @Column("varchar",{ length : "20", nullable : true})
    kind : string;

    @IsInt()
    @Column({ type : "smallint", nullable : true})
    delivered : number;

    @IsString()
    @Column({ type : "date" , nullable : true})
    launched : string

    @IsInt()
    @Column({ type : "smallint"})
    methodology : number;

    @IsString()
    @Column({ type : "text", nullable : true})
    notes : string;

    @IsString()
    @Column("varchar",{ length : 20 , unique : true})
    name : string;

    @IsNumber()
    @Column({ type : "float", nullable : true})
    risk : number;

    @IsString()
    @Column({ type : "date", nullable : true})
    scheduled : string

    @IsInt()
    @Column({ type : "smallint", nullable : true})
    status : number;

    @IsString()
    @Column("varchar",{ length : 20, nullable : true})
    tool : string;

    @Column({type : "smallint", nullable : true})
    vtc : number;
    @Column({type : "smallint", nullable : true})
    vth : number;
    @Column({type : "smallint", nullable : true})
    vtm : number;
    @Column({type : "smallint", nullable : true})
    vtl : number;
    @Column({type : "smallint", nullable : true})
    vti : number;
    @Column({type : "smallint", nullable : true})
    vfc : number;
    @Column({type : "smallint", nullable : true})
    vfh : number;
    @Column({type : "smallint", nullable : true})
    vfm : number;
    @Column({type : "smallint", nullable : true})
    vfl : number;
    @Column({type : "smallint", nullable : true})
    vfi : number;
    @Column({type : "smallint", nullable : true})
    vac : number;
    @Column({type : "smallint", nullable : true})
    vah : number;
    @Column({type : "smallint", nullable : true})
    vam : number;
    @Column({type : "smallint", nullable : true})
    val : number;
    @Column({type : "smallint", nullable : true})
    vai : number;


    @IsDefined()
    @ValidateNested()
    @Type(()=> Asset)
    @ManyToOne( () => Asset, asset => asset.audits, { onDelete : "SET NULL"} )
    asset : Asset;


    @ValidateNested()
    @Type(()=> Url)
    @ManyToOne( () => Url, url => url.audits , { onDelete : "SET NULL"} )
    url : Url;


    @ValidateNested({
        each : true
    })
    @Type(()=> Vulnerability)
    @OneToMany(() => Vulnerability, (vulnerability) => vulnerability.audit)
    vulnerabilities : Vulnerability[];

    
    @IsDefined()
    @ValidateNested()
    @Type(()=> Company)
    @ManyToOne( type => Company, (company : Company) => company.audits)
    public company : Company;

}

export default Audit;