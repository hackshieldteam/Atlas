import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, OneToMany } from "typeorm";
import { IsDefined, ValidateNested, IsString } from "class-validator";
import User from "./user.entity";
import { Type } from "class-transformer";
import Evidence from "./evidence.entity";
import Company from "./company.entity";
import Test from "./test.entity";

@Entity()
class Test_Instance {
    @IsDefined()
    @PrimaryGeneratedColumn()
    id!: number;

    @ValidateNested()
    @Type(() => User)
    @ManyToOne(type => User, (user: User) => user.tests)
    user: User;

    @IsString()
    @Column("date", { nullable: true })
    date: string;

    @IsString()
    @Column("text", { nullable: true })
    description: string;

    @ValidateNested()
    @Type(() => Evidence)
    @OneToMany(type => Evidence, (evidence: Evidence) => { evidence.test_instance })
    evidences: Evidence[]

    @ValidateNested()
    @Type(()=> Test)
    @ManyToOne(type => Test, (test : Test) => test.instances)
    public test : Test

    @ValidateNested()
    @Type(() => Company)
    @ManyToOne(type => Company, (company: Company) => company.assets)
    public company: Company;

}


export default Test_Instance
