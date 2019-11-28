import { getRepository } from 'typeorm';
import {CreateIntegrationDto,  UpdateIntegrationDto, FindIntegrationDto} from './integration.dto';
import Integration from './integration.entity';
import { modifyEntries } from '../../utils/modifyEntries';



class IntegrationService {
    private integrationRepository = getRepository(Integration)

    public addIntegration = async (integrationData: CreateIntegrationDto) => {
        try {
            const integration = this.integrationRepository.save(integrationData);
            return(integration)
        } catch (error) {
            switch (error.code) {
                case "23503":
                    throw new Error("Reference is missing")
                case "23505":
                    throw new Error("Integrations already exist")
                default:
                    throw new Error(error.message);
            }
        }
    }

    public getIntegration = async (id: number) => {
        const integration = await this.integrationRepository.findOne(id);
        return (integration);
    }

    public getIntegrations = async (filters: FindIntegrationDto[], limit, offset) => {
        modifyEntries(filters)
        const integrations : Integration[] = await this.integrationRepository.find({ where : filters});
        return(integrations);
        /*let qb = this.integrationRepository.createQueryBuilder("integration");
        
        var i = 0;
        var querystrings = [];
        var queryobjs = [];
        filters.forEach(filter => {
            let obj = {};
            var query = []
            Object.keys(filter).forEach(param => {
                switch (param) {
                    case "name":
                        query.push("integration.name LIKE :name"+i)
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
        const integrations = qb.getMany();
        return integrations;*/
    }

    public modifyIntegration = async (id : number,integrationData : UpdateIntegrationDto) => {
        var integration : Integration = await this.integrationRepository.findOne(id);
        if(integration){
            const updatedIntegration = await this.integrationRepository.save(Object.assign(integration,integrationData));
            return(updatedIntegration);
        }else{
            return(null)
        }
    }

    public deleteIntegration = async (id : number) => {
        const deletedIntegration = await this.integrationRepository.delete(id);
        return(deletedIntegration);
    }





}


export default IntegrationService;
