import { Entity, Index, PrimaryGeneratedColumn, Column } from "typeorm";
import { IsInt, IsString } from "class-validator";




@Entity()
class KnowledgeBase{

@IsInt()
@PrimaryGeneratedColumn()
id : number


@IsString()
@Column("varchar",{ length : 100,nullable : false })
name : string;

@IsString()
@Column("varchar",{ length : 15,nullable : false })
category : string

@IsString()
@Column("text", { nullable : false})
content : string
}

export default KnowledgeBase;