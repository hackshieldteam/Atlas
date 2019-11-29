import {Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, OneToMany, ManyToOne, ManyToMany} from "typeorm";
import Asset from "./asset.entity";
import Responsable from "./responsable.entity"

@Entity()
class ResponsableToAsset{



    @PrimaryColumn({type : "integer"})
    public responsableId : number;
    @PrimaryColumn({type : "integer"})
    public assetId : number;

    @PrimaryColumn("varchar",{ length : 50})
    public role : string;

    @Column("varchar",{ length : 50})
    public info : string;

    @ManyToMany( type => Asset, asset => asset.responsables)
    public asset! : Asset;

    @ManyToMany( type => Responsable, responsable => responsable.assets)
    public responsable! : Responsable;

}

export default ResponsableToAsset;
