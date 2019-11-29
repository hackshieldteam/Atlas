import { Entity, Column,PrimaryGeneratedColumn, OneToMany, ManyToOne, Index, ManyToMany, JoinTable } from "typeorm";
import { IsDefined, IsString, IsNotEmpty, ValidateNested, IsArray } from "class-validator";
import Test from "./test.entity";
import Company from "./company.entity";
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

    @IsString()
    @Column("text")
    description : string


    @ValidateNested({
        each : true
    })
    @IsArray()
    @ManyToMany(type => Test, (test: Test) => test.methodologies)
    @JoinTable()
    public tests: Test[]

    @ValidateNested()
    @Type(() => Company)
    @ManyToOne(type => Company, (company: Company) => company.assets)
    public company: Company;

}

export default Methodology;
