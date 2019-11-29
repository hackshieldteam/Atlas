import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, OneToMany, ManyToOne, ManyToMany, Index} from "typeorm";
import Asset from "./asset.entity";
import Company from "./company.entity";
import Department from "./department.entity";
import { IsInt, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

@Entity()
@Index(["name","company"],{unique : true})
class Area{

    @IsInt()
    @PrimaryGeneratedColumn()
    id : number;

    @IsString()
    @Column("varchar",{ length : 15 })
    name : string;

    @ValidateNested()
    @Type(()=> Company)
    @ManyToOne(() => Company, company => company.areas, { nullable : false, onDelete : "CASCADE"})
    company : Company;

    @ValidateNested()
    @Type(()=> Asset)
    @OneToMany( () => Asset, asset => asset.businessArea )
    assets : Asset[]
    
    @ValidateNested()
    @Type(()=> Department)
    @OneToMany( () => Department, department => department.area )
    departments : Department[]


}

export default Area;
