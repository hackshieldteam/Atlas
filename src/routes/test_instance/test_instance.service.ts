import { getRepository, Like } from 'typeorm';
import Test_Instance from 'entities/test_instance.entity';
import { CreateTestInstanceDto, FindTestInstanceDto, UpdateTestInstanceDto } from './test_instance.dto';


class TestInstanceService {
    private testInstanceRepository = getRepository(Test_Instance)

    public addTestInstance = async (testInstanceData: CreateTestInstanceDto) => {
        try {
            const testInstance = await this.testInstanceRepository.save(testInstanceData);
            return(testInstance)
        } catch (error) {
            switch (error.code) {
                case "42601":
                        throw new Error("Syntax error")
                case "23503":
                    throw new Error("Reference is missing")
                case "23505":
                    throw new Error("TestInstance already exist")
                default:
                    throw new Error("Unknown error");
            }
        }
    }

    public getTestInstance = async (filters,relations) => {
        try {
            const testInstance = await this.testInstanceRepository.findOne({where : filters, relations : relations});
            return (testInstance);
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



    

    public getTestInstances = async (filters: FindTestInstanceDto[], limit, offset) => {
        try {
            const testInstances  = await this.testInstanceRepository.findAndCount({ where : filters, relations : ["company"]})
            return(testInstances);
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

    public modifyTestInstance = async (id,testInstanceData : UpdateTestInstanceDto) => {
        try {
            var testInstance : Test_Instance = await this.testInstanceRepository.findOne(id)
            if(testInstance){
                const updatedTestInstance = await this.testInstanceRepository.save(Object.assign(testInstance,testInstanceData));
                return(updatedTestInstance)
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
                    throw new Error("Unknown error");
            }
        }
    }

    public deleteTestInstance = async (id) => {
        try {
            const deletedTestInstance = await this.testInstanceRepository.delete(id);
            return(deletedTestInstance);            
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


export default TestInstanceService;
