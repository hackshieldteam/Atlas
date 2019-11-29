import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, OneToMany, ManyToOne, ManyToMany, Index} from "typeorm";
import { IsInt, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import Vulnerability from "./vulnerability.entity";

@Entity()
class Tracking{

    @IsInt()
    @PrimaryGeneratedColumn()
    id : number;

    @IsString()
    @Column("varchar",{ length : 15 })
    key : string;

    @IsString()
    @Column("varchar",{ length : 15 })
    jira_id : string;

    @IsString()
    @Column("varchar",{ length : 15 })
    jira_path : string;

    @IsString()
    @Column("varchar",{ length : 15 })
    status : string;

    @ValidateNested()
    @Type(()=> Vulnerability)
    @ManyToOne(() => Vulnerability, vulnerability => vulnerability.trackings, { nullable : false, onDelete : "CASCADE"})
    vulnerability : Vulnerability;
}

export default Tracking;
