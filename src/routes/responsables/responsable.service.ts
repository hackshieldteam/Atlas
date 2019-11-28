import { getRepository } from 'typeorm';
import {CreateResponsableDto,  UpdateResponsableDto, FindResponsableDto} from './responsable.dto';
import Responsable from './responsable.entity';
import ResponsableToAsset from './responsabletoasset.entity';
import { modifyEntries } from '../../utils/modifyEntries';



class ResponsableService {
    private responsableRepository = getRepository(Responsable)
    private responsableToAssetRepository = getRepository(ResponsableToAsset)

    public addResponsable = async (responsableData: CreateResponsableDto) => {
        try {
            const responsable = this.responsableRepository.save(responsableData);
            return(responsable)
        } catch (error) {
            switch (error.code) {
                case "23503":
                    throw new Error("Reference is missing")
                case "23505":
                    throw new Error("Responsable already exist")
                default:
                    throw new Error(error.message);
            }
        }
    }

    public getResponsable = async (id: number) => {
        const responsable = await this.responsableRepository.findOne(id);
        return (responsable);
    }

    public getResponsableAssets = async ( id: number) => {
        const responsable : Responsable = await this.responsableRepository.findOne({ where : { id : id },  relations : ["assets"]})
        if(responsable){
            return (responsable.assets)
        }else return(null)
    }


    

    public getResponsables = async (filters: FindResponsableDto[], limit, offset) => {
       modifyEntries(filters)
       const responsables : Responsable[] = await this.responsableRepository.find({where:filters})
       return(responsables)
        /* let qb = this.responsableRepository.createQueryBuilder("responsable");
        
        var i = 0;
        var querystrings = [];
        var queryobjs = [];
        filters.forEach(filter => {
            let obj = {};
            var query = []
            Object.keys(filter).forEach(param => {
                switch (param) {
                    case "name":
                        query.push("responsable.name LIKE :name"+i)
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
        const responsables = qb.getMany();
        return responsables;*/
    }

    public modifyResponsable = async (id : number,responsableData : UpdateResponsableDto) => {
        var responsable : Responsable = await this.responsableRepository.findOne(id);
        if(responsable){
            const modifyResponsable = await this.responsableRepository.save(Object.assign(responsable,responsableData));
            return(modifyResponsable);
        }else{
            return(null)
        }
    }

    public deleteResponsable = async (id : number) => {
        const deletedResponsable = await this.responsableRepository.delete(id);
        return(deletedResponsable);
    }





}


export default ResponsableService;
