import {Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, OneToMany, ManyToOne, ManyToMany} from "typeorm";
import Vulnerability from "./vulnerability.entity"

@Entity()
class Jira{

    @PrimaryGeneratedColumn()
    id : number;

    @Column("varchar",{ length : 250 , unique : true})
    name : string;

    @Column("varchar",{ length : 250 , unique : true})
    homePath : string;

    @Column("varchar",{ length : 250 , unique : true})
    consumerKey : string;

    @Column("varchar",{ length : 250 , unique : true})
    consumerPrivateKey : string;

    @Column("varchar",{ length : 250 , unique : true})
    accessToken : string;

    @Column("text",{ nullable : true})
    description : string;

    @ManyToOne(() => Vulnerability, vulnerability => vulnerability.jira, { onDelete : "CASCADE"})
    vulnerability : Vulnerability;
}

export default Jira;
