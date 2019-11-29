import { getRepository, Like } from 'typeorm';
import Test from '../../entities/test.entity';
import { CreateTestDto, FindTestDto, UpdateTestDto } from './test.dto';


class TestService {
    private testRepository = getRepository(Test)

    public addTest = async (testData: CreateTestDto) => {
        try {
            const test = await this.testRepository.save(testData);
            return(test)
        } catch (error) {
            switch (error.code) {
                case "42601":
                        throw new Error("Syntax error")
                case "23503":
                    throw new Error("Reference is missing")
                case "23505":
                    throw new Error("Test already exist")
                default:
                    throw new Error("Unknown error");
            }
        }
    }

    public getTest = async (filters,relations) => {
        try {
            const test = await this.testRepository.findOne({where : filters, relations : relations});
            return (test);
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




    

    public getTests = async (filters: FindTestDto[], limit, offset) => {
        try {
            const tests  = await this.testRepository.findAndCount({ where : filters, relations : ["company"]})
            return(tests);
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

    public modifyTest = async (id,testData : UpdateTestDto) => {
        try {
            var test : Test = await this.testRepository.findOne(id)
            if(test){
                const updatedTest = await this.testRepository.save(Object.assign(test,testData));
                return(updatedTest)
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

    public deleteTest = async (id) => {
        try {
            const deletedTest = await this.testRepository.delete(id);
            return(deletedTest);            
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


export default TestService;
