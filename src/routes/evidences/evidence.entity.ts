import {Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, OneToMany, ManyToOne, ManyToMany} from "typeorm";
import Vulnerability from "../vulnerabilities/vulnerability.entity"

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
}

export default Evidence;