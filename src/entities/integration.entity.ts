import {Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, OneToMany, ManyToOne, ManyToMany} from "typeorm";
import Asset from "./asset.entity";
import { IsInt, IsOptional, ValidateNested, IsDefined, IsString } from "class-validator";
import { Type } from "class-transformer";

@Entity()
class Integration{

    @IsDefined()
    @IsInt()
    @PrimaryGeneratedColumn()
    id : number;

    @IsInt()
    @Column({ type : "smallint" })
    kind : number;

    @IsString()
    @Column({ type : "text"})
    comment : string;

    @IsInt()
    @Column({ type : "smallint" })
    ndone : number;
    
    @IsInt()
    @Column({ type : "smallint" })
    ntotal : number;

    @IsString()
    @Column("date")
    papDate : string;

    @IsInt()
    @Column("smallint")
    status : number;

    @IsString()
    @Column("date")
    startDate : string

    @ValidateNested()
    @Type(()=> Asset)
    @ManyToOne(() => Asset, (asset : Asset) => asset.integrations, { onDelete : "CASCADE"})
    asset : Asset


}

export default Integration;
