import { Entity, Column,PrimaryGeneratedColumn, OneToMany, ManyToOne } from "typeorm";
import { IsDefined, IsString, IsNotEmpty, ValidateNested, IsArray } from "class-validator";
import Test from "../tests/test.entity";
import Company from "../companies/company.entity";
import { Type } from "class-transformer";




@Entity()
class Methodology {
    @IsDefined()
    @PrimaryGeneratedColumn()
    id!: number;

    @IsString()
    @Column("varchar",{ length : 15 })
    name: string;

    @IsArray()
    @ValidateNested({
        each : true
    })
    @Type(() => Test)
    @OneToMany(type => Test, (test: Test) => test.methodology)
    public tests: Test[]

    @ValidateNested()
    @Type(() => Company)
    @ManyToOne(type => Company, (company: Company) => company.assets)
    public company: Company;

}

export default Methodology;