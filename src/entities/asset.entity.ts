import {Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, OneToMany, ManyToOne, ManyToMany, JoinTable, Index} from "typeorm";
import Group from "./group.entity";
import Area from "./area.entity";
import Department from "./department.entity";
import ResponsableToAsset from "./responsabletoasset.entity";
import Tag from "./tag.entity";
import Integration from "./integration.entity";
import Url from "./url.entity";
import Audit from "./audit.entity";
import Company from "./company.entity";
import { IsOptional, ValidateNested, IsDefined, IsString, IsInt, IsIn, IsNumber } from "class-validator";
import { Type } from "class-transformer";

@Entity()
@Index(["name","company"],{unique : true})
class Asset{

    @IsDefined()
    @PrimaryGeneratedColumn()
    id! : number;

    @IsString()
    @Column("varchar",{length : 15, nullable : true})
    alias : string

    @IsInt()
    @Column("smallint",{ nullable : true})
    authentication : number;

    @IsInt()
    @Column("smallint",{ nullable : true})
    authorization : number;

    @IsInt()
    @Column("smallint",{ nullable : true})
    availability : number;

    @IsInt()
    @Column("smallint",{ nullable : true})
    class! : number;

    @IsInt()
    @Column("smallint",{ nullable : true})
    confidenciality : number;

    @IsString()
    @Column("text",{ nullable : true})
    description : string;

    @IsInt()
    @Column("smallint",{ nullable : true})
    enviroment! : number;

    @IsString()
    @Column("varchar",{length : 10, unique : true, nullable : true})
    hgf : string;

    @IsInt()
    @Column("smallint",{ nullable : true})
    integrity : number;

    
    @IsString()
    @Column("varchar",{ length : 50 , unique : true})
    name! : string;
    
    @IsInt()
    @Column("smallint")
    status! : number;
    
    @IsString()
    @Column("date",{ nullable : true})
    statusDate : string;
    
    @IsInt()
    @Column("smallint",{ nullable : true})
    trazability : number;
    
    @IsInt()
    @Column("smallint",{ nullable : true})
    visibility! : number;
    
    @IsInt()
    @Column("smallint",{ nullable : true})
    volumetry : number;

    @ValidateNested({
        each: true
    })
    @Type(() => Integration)
    @OneToMany(type => Integration , (integration : Integration) => integration.asset, {
        cascade : true
    })
    integrations : Integration[];

    @ValidateNested()
    @Type(() => Area) 
    @ManyToOne(type => Area, (area : Area) => area.assets, { onDelete : "SET NULL"})
    businessArea : Area

    @ValidateNested()
    @Type(() => Company)
    @ManyToOne( type => Company, (company : Company) => company.assets)
    public company : Company;
    

    @ValidateNested()
    @Type(() => Department)
    @ManyToOne(type => Department, (department : Department) => department.assets, { onDelete : "SET NULL"})
    department : Department
    
    @ValidateNested({
        each : true
    })
    @Type(() => ResponsableToAsset)
    @OneToMany(type => ResponsableToAsset, (responsableToAsset) => responsableToAsset.asset, { onDelete : "SET NULL"})
    public responsables! : ResponsableToAsset[]


    @ValidateNested({
        each : true
    })
    @Type(() => Tag)
    @ManyToMany(type => Tag, tag => tag.assets,{
        cascade : true
    })
    @JoinTable()
    tags : Tag[]

    @ValidateNested({
        each : true
    })
    @Type(() => Url)
    @OneToMany(type => Url,(url : Url) => url.asset, {
        cascade : true
    })
    urls : Url[]

    @ValidateNested({
        each : true
    })
    @Type(() => Group)
    @ManyToMany(type => Group, group => group.assets)
    groups : Group[];

    @ValidateNested({
        each : true
    })
    @Type(() => Audit)
    @OneToMany(() => Audit, (audit => audit.asset))
    audits : Audit[];


}

export default Asset;

