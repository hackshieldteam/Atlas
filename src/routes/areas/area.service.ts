import { getRepository, Like } from 'typeorm';
import {CreateAreaDto,  UpdateAreaDto, FindAreaDto} from './area.dto';
import Area from '../../entities/area.entity';


class AreaService {
    private areaRepository = getRepository(Area)

    public addArea = async (areaData: CreateAreaDto) => {
        try {
            const area = await this.areaRepository.save(areaData);
            return(area)
        } catch (error) {
            switch (error.code) {
                case "42601":
                        throw new Error("Syntax error")
                case "23503":
                    throw new Error("Reference is missing")
                case "23505":
                    throw new Error("Area already exist")
                default:
                    throw new Error("Unknown error");
            }
        }
    }

    public getArea = async (filters,relations) => {
        try {
            const area = await this.areaRepository.findOne({where : filters, relations : relations});
            return (area);
        } catch (error) {
            switch (error.code) {
                case "42601":
                        throw new Error("Syntax error")
                case "23503":
                    throw new Error("Reference is missing")
                default:
                    throw new Error("Unknown error");
            }
        }
    }

    public getAreaAssets = async ( id: number) => {
        try {
            const area : Area = await this.areaRepository.findOne({ where : { id : id },  relations : ["assets"]})
            if(area){
                return(area.assets)
            }else return (null);
        } catch (error) {
            switch (error.code) {
                case "42601":
                        throw new Error("Syntax error")
                case "23503":
                    throw new Error("Reference is missing")
                default:
                    throw new Error("Unknown error");
            }
        }
    }

    public getAreaDepartments = async ( id: number) => {
        try {
            const area : Area = await this.areaRepository.findOne({ where : { id : id }, relations : ["departments"]})
            if(area){
                return(area.departments)
            }else return (null);
        } catch (error) {
            switch (error.code) {
                case "42601":
                        throw new Error("Syntax error")
                case "23503":
                    throw new Error("Reference is missing")
                default:
                    throw new Error("Unknown error");
            }
        }
    }

    

    public getAreas = async (filters: FindAreaDto[], limit, offset) => {
        try {
            const areas  = await this.areaRepository.findAndCount({ where : filters, relations : ["company"]})
            return(areas);
        } catch (error) {
            switch (error.code) {
                case "42601":
                        throw new Error("Syntax error")
                case "23503":
                    throw new Error("Reference is missing")
                default:
                    throw new Error("Unknown error");
            }
        }
    }

    public modifyArea = async (id,areaData : UpdateAreaDto) => {
        try {
            var area : Area = await this.areaRepository.findOne(id)
            if(area){
                const updatedArea = await this.areaRepository.save(Object.assign(area,areaData));
                return(updatedArea)
            }else{
                return(null)
            }
        } catch (error) {
            switch (error.code) {
                case "42601":
                        throw new Error("Syntax error")
                case "23505":
                    throw new Error("Company already exist")
                default:
                    console.log(error)
                    throw new Error("Unknown error");
            }
        }
    }

    public deleteArea = async (id) => {
        try {
            const deletedArea = await this.areaRepository.delete(id);
            return(deletedArea);            
        } catch (error) {
            switch (error.code) {
                case "42601":
                        throw new Error("Syntax error")
                default:
                    throw new Error("Unknown error");
            }
        }
    }





}


export default AreaService;
