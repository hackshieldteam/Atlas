import {Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, OneToMany, ManyToOne, ManyToMany} from "typeorm";
import Vulnerability from "../vulnerabilities/vulnerability.entity"
import Test_Instance from "../test_instance/test_instance.entity";

@Entity()
class Evidence{

    @PrimaryGeneratedColumn()
    id : number;

    @Column("varchar",{ length : 250 , unique : true})
    path : string;

    @Column("smallint")
    class : number

    @Column("text",{ nullable : true})
    description : string;

    @ManyToOne(() => Vulnerability, vulnerability => vulnerability.evidences, { onDelete : "CASCADE"})
    vulnerability : Vulnerability;

    @ManyToMany(()=> Test_Instance, test_instance => test_instance.evidences,{ onDelete : "CASCADE"})
    test_instance : Test_Instance;
}

export default Evidence;