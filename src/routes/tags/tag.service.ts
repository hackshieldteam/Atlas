import { getRepository } from 'typeorm';
import {CreateTagDto,  UpdateTagDto, FindTagDto} from './tag.dto';
import Tag from '../../entities/tag.entity';
import { modifyEntries } from '../../utils/modifyEntries';



class TagService {
    private tagRepository = getRepository(Tag)

    public addTag = async (tagData: CreateTagDto) => {
        try {
            const tag = this.tagRepository.save(tagData);
            return(tag)
        } catch (error) {
            switch (error.code) {
                case "23503":
                    throw new Error("Reference is missing")
                case "23505":
                    throw new Error("Tag already exist")
                default:
                    throw new Error(error.message);
            }
        }
    }

    public getTag = async (id: number) => {
        const tag = await this.tagRepository.findOne(id);
        return (tag);
    }

    public getTagAssets = async ( id: number) => {
        const tag : Tag = await this.tagRepository.findOne({ where : { id : id },  relations : ["assets"]})
        if(tag){
            return(tag.assets)
        }else return (null);
    }

    

    public getTags = async (filters: FindTagDto[], limit, offset) => {
        modifyEntries(filters)
        const tags : Tag[] = await this.tagRepository.find({where : filters})
        return(tags)
        /*let qb = this.tagRepository.createQueryBuilder("tag");
        
        var i = 0;
        var querystrings = [];
        var queryobjs = [];
        filters.forEach(filter => {
            let obj = {};
            var query = []
            Object.keys(filter).forEach(param => {
                switch (param) {
                    case "name":
                        query.push("tag.name LIKE :name"+i)
                        obj["name"+i]= "%"+filter[param]+"%"
                        break;
                    default:
                        break;
                }
            })
            i++;
            queryobjs.push(obj)
            querystrings.push(query.join(" AND "));
        })
        var i = 0;
        for(i=0;i<queryobjs.length;i++){
            qb.orWhere(querystrings[i],queryobjs[i])
        }

        qb.take(limit)
        qb.skip(offset)
        const tags = qb.getMany();
        return tags;*/
    }

    public modifyTag = async (id : number,tagData : UpdateTagDto) => {
        var tag : Tag = await this.tagRepository.findOne(id);
        if(tag){
            const updatedTag = await this.tagRepository.save(Object.assign(tag,tagData));
            return(updatedTag);
        }else{
            return(null)
        }
    }

    public deleteTag = async (id : number) => {
        const deletedTag = await this.tagRepository.delete(id);
        return(deletedTag);
    }





}


export default TagService;
