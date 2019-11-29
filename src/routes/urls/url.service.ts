import { getRepository } from 'typeorm';
import {CreateUrlDto,  UpdateUrlDto, FindUrlDto} from './url.dto';
import Url from '../../entities/url.entity'
import { modifyEntries } from '../../utils/modifyEntries';



class UrlService {
    private urlRepository = getRepository(Url)

    public addUrl = async (urlData: CreateUrlDto) => {
        try {
            const Url = this.urlRepository.save(urlData);
            return(Url)
        } catch (error) {
            switch (error.code) {
                case "23503":
                    throw new Error("Reference is missing")
                case "23505":
                    throw new Error("Url already exist")
                default:
                    throw new Error(error.message);
            }
        }
    }

    public getUrl = async (id: number) => {
        const Url = await this.urlRepository.findOne(id);
        return (Url);
    }

  
    

    public getUrls = async (filters: FindUrlDto[], limit, offset) => {
       modifyEntries(filters)
       const urls : Url[] = await this.urlRepository.find({where:filters});
       return(urls)
        /* let qb = this.urlRepository.createQueryBuilder("url");
        
        var i = 0;
        var querystrings = [];
        var queryobjs = [];
        filters.forEach(filter => {
            let obj = {};
            var query = []
            Object.keys(filter).forEach(param => {
                switch (param) {
                    case "url":
                        query.push("url.url LIKE :url"+i)
                        obj["url"+i]= "%"+filter[param]+"%"
                        break;
                    case "enviroment":
                        query.push("url.enviroment LIKE :enviroment"+i)
                        obj["enviroment"+i]= "%"+filter[param]+"%"
                        break;
                    case "port":
                        query.push("url.port = :port"+i)
                        obj["port"+i]= "%"+filter[param]+"%"
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
        const urls = qb.getMany();
        return urls;*/
    }

    public modifyUrl = async (id : number,urlData : UpdateUrlDto) => {
        var Url : Url = await this.urlRepository.findOne(id);
        if(Url){
            
            const modifyedUrl = await this.urlRepository.save(Object.assign(Url,urlData));
            return(modifyedUrl);
        }else{
            return(null)
        }
    }

    public deleteUrl = async (id : number) => {
        const deletedUrl = await this.urlRepository.delete(id);
        return(deletedUrl);
    }





}


export default UrlService;
