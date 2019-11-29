import { getRepository } from 'typeorm';
import Functionality from '../../entities/functionality.entity';



class FunctionalityService {
    private functionalityRepository = getRepository(Functionality);


    public getFunctionality = async (id : number) => {
        const functionality = await this.functionalityRepository.findOne(id);
        return(functionality);
    }

}
