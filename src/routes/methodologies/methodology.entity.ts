import { Entity, Column,PrimaryGeneratedColumn, OneToMany, ManyToOne, Index } from "typeorm";
import { IsDefined, IsString, IsNotEmpty, ValidateNested, IsArray } from "class-validator";
import Test from "../tests/test.entity";
import Company from "../companies/company.entity";
import { Type } from "class-transformer";




@Entity()
@Index(["name","company"],{ unique : true})
class Methodology {
    @IsDefined()
    @PrimaryGeneratedColumn()
    id!: number;

    @IsString()
    @Column("varchar",{ length : 50 })
    name: string;

    @Type(() => Test)
    @OneToMany(type => Test, (test: Test) => test.methodology,{ cascade : ["insert"]})
    public tests: Test[]

    @ValidateNested()
    @Type(() => Company)
    @ManyToOne(type => Company, (company: Company) => company.assets)
    public company: Company;

}

export default Methodology;