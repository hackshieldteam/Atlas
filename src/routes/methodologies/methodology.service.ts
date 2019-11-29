import { getRepository } from "typeorm";
import Methodology from "../../entities/methodology.entity";
import { CreateMethodologyDto, FindMethodologyDto, UpdateMethodologyDto } from "./methodology.dto";

class MethodologyService{
private methodologyRepository = getRepository(Methodology)

public addMethodology = async ( methodologyData : CreateMethodologyDto) => {
    try {
        const methodology = await this.methodologyRepository.save(methodologyData)
        return(methodology)
    } catch (error) {
        switch (error.code) {
            case "42601":
                    throw new Error("Syntax error")
            case "23503":
                throw new Error("Reference is missing")
            case "23505":
                throw new Error("Methodology already exist")
            default:
                throw new Error("Unknown error");
        }
    }
}

public getMethodology = async( filters,relations) => {
    try {
        const methodology = await this.methodologyRepository.findOne({where : filters, relations : relations})
        return (methodology);
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


public getMethodologies = async(filters : FindMethodologyDto[], limit, offset) => {
    try {
        const methodologies = await this.methodologyRepository.findAndCount({ where : filters, relations : ["tests"]})
        return methodologies;
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

public modifyMethodology = async (id, methodologyData : UpdateMethodologyDto) => {
    try {
        var methodology : Methodology = await this.methodologyRepository.findOne(id)
        if(methodology){
            const updatedMethodology = await this.methodologyRepository.save(Object.assign(methodology,methodologyData))
            return updatedMethodology
        }else{
            return (null)
        }
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

public deleteMethodology = async (id) => {
    try {
        const deletedMethodology = await this.methodologyRepository.delete(id);
        return(deletedMethodology);            
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

export default MethodologyService;
