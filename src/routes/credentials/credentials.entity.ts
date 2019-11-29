import { Entity, Index, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { IsInt, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import Company from "../companies/company.entity";




@Entity()
@Index(["name","company"],{ unique : true})
class Credential{

    @IsInt()
    @PrimaryGeneratedColumn()
    id : number

    @IsString()
    @Column("varchar",{ length : 20})
    name : string

    @IsString()
    @Column("varchar",{ length : 250})
    homePath : string

    @IsString()
    @Column({type:"text"})
    consumerKey : string

    @IsString()
    @Column({type:"text"})
    consumerPrivateKey : string


    @IsString()
    @Column({type:"text"})
    description : string


    @IsString()
    @Column({type:"text"})
    token : string


    @ValidateNested()
    @Type(()=> Company)
    @ManyToOne(() => Company, company => company.areas, { nullable : false, onDelete : "CASCADE"})
    company : Company;
}


export default Credential;