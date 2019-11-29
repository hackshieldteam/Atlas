import { getRepository } from 'typeorm';
import KnowledgeBase from '../../entities/knowledgeBase.entity';
import { CreateKnowledgeDto, UpdateKnowledgeDto, FindKnowledgeDto } from './knowledgeBase.dto';
import { modifyEntries } from '../../utils/modifyEntries';


class KnowledgeBaseService {
    private knowledgeBaseRepository = getRepository(KnowledgeBase);

    public addKnowledgeBase = async (knowledgeBaseData: CreateKnowledgeDto) => {
        try {
            const newKnowledgeBase = await this.knowledgeBaseRepository.save(knowledgeBaseData);
            return (newKnowledgeBase);
        } catch (error) {
            switch (error.code) {
                case "42601":
                        throw new Error("Syntax error")
                case "23503":
                    throw new Error("Reference is missing")
                case "23505":
                    throw new Error("KnowledgeBase already exist")
                default:
                    throw new Error("Unknown error");
            }
        }
    }

    public getKnowledgeBase = async (id: number) => {
        try {
            const knowledgeBase = await this.knowledgeBaseRepository.findOne({ where: { id: id }, relations: ["functionalities"] });
            return (knowledgeBase)
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

    public getKnowledgeBases = async (filters, limit, offset) => {
        try {
            const knowledgeBases  = await this.knowledgeBaseRepository.findAndCount({where : filters, relations : ["users"]});
            return(knowledgeBases);      
        } catch (error) {
            switch (error.code) {
                case "42601":
                        throw new Error("Syntax error")
                default:
                    throw new Error("Unknown error");
            }
        }
    }

    public modifyKnowledgeBase = async (id, knowledgeBaseData: UpdateKnowledgeDto) => {
        try {
            var knowledgeBase : KnowledgeBase = await this.knowledgeBaseRepository.findOne(id)
            if (knowledgeBase) {
                    const updatedKnowledgeBase = await this.knowledgeBaseRepository.save(Object.assign(knowledgeBase,knowledgeBaseData));
                    return(updatedKnowledgeBase)  
            } else {
                return (null)
            }    
        } catch (error) {
            switch (error.code) {
                case "42601":
                        throw new Error("Syntax error")
                case "23505":
                    throw new Error("Company already exist")
                default:
                    throw new Error("Unknown error");
            }
        }      
    }
    public deleteKnowledgeBase = async (id) => {
        try {
            const deletedKnowledgeBase = await this.knowledgeBaseRepository.delete(id);
            return (deletedKnowledgeBase);
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

export default KnowledgeBaseService;
