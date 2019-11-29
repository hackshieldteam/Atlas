import { getRepository } from 'typeorm';
import Company from '../../entities/company.entity';
import {CreateCompanyDto,  UpdateCompanyDto, FindCompanyDto} from './company.dto';
import Area from '../../entities/area.entity';
import { modifyEntries } from '../../utils/modifyEntries';



class CompanyService {
    private companyRepository = getRepository(Company)


    public addCompany = async (companyData: CreateCompanyDto) => {
        try {
            const company = await this.companyRepository.save(companyData);
            return (company);
        } catch (error) {
            switch (error.code) {
                case "42601":
                        throw new Error("Syntax error")
                case "23503":
                    throw new Error("Reference is missing")
                case "23505":
                    throw new Error("Company already exist")
                default:
                    throw new Error("Unknown error");
            }
        }
    }

    public getCompany = async (id: number) => {
        try {
            const company = await this.companyRepository.findOne(id);
            return (company);
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

    public getCompanyGroups = async (id : number) => {
        try {
            const company : Company = await this.companyRepository.findOne({ where : { id : id }, select : ["groups"], relations : ["group"]})
            if(company){
                return(company.groups)
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

    public getCompanyAreas = async (id : number) => {
        try {
            const company : Company = await this.companyRepository.findOne({ where : { id : id }, select : ["areas"], relations : ["area"]})
            if(company){
                return(company.areas)
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

    public getCompanies = async (filters, limit, offset) => {
        try {      
            const companies  = await this.companyRepository.findAndCount({where : filters})
            return(companies)
        } catch (error) {
            switch (error.code) {
                case "42601":
                        throw new Error("Syntax error")
                default:
                    throw new Error("Unknown error");
            }
        }
    }

    public modifyCompany = async (id,companyData : UpdateCompanyDto) => {
        try {
            var company : Company = await this.companyRepository.findOne(id);
            if(company){
                const updatedCompany = await this.companyRepository.save(Object.assign(company,companyData));
                return(updatedCompany);
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

    public deleteCompany = async (id) => {
        try {
            const deletedCompany = await this.companyRepository.delete(id);
            return(deletedCompany);            
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


export default CompanyService;
