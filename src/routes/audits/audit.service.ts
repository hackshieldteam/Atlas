import { getRepository } from 'typeorm';

import {CreateAuditDto,  UpdateAuditDto, FindAuditDto} from './audit.dto';
import Audit from './audit.entity';



class AuditService {
    private auditRepository = getRepository(Audit)


    public addAudit = async (auditData: CreateAuditDto) => {
        try {            
            const audit = await this.auditRepository.save(auditData);
            return (audit);
        } catch (error) {
            switch (error.code) {
                case "42601":
                    throw new Error("Syntax error")
                case "23503":
                    throw new Error("Reference is missing")
                case "23505":
                    throw new Error("Audit already exist")
                default:
                    throw new Error(error.message);
            }
        }
    }
    public getAudit = async (filters,relations) => {
        try {
            const audit = await this.auditRepository.findOne({where : filters, relations: relations});
            return (audit);
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
    public getAuditVulnerabilities = async (id: number) => {
        try {
            const audit = await this.auditRepository.findOne({ where : { id : id}, relations : ["vulnerabilities"]});
            if(audit){
                return(audit.vulnerabilities);
            }else return(null);
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
    public getAudits = async (filters, limit, offset) => {
        try {
            const audits  = await this.auditRepository.findAndCount({where : filters});
            return(audits);
        } catch (error) {
            switch (error.code) {
                case "42601":
                    throw new Error("Syntax error")
                case "23503":
                    throw new Error("Reference is missing")
                default:
                    console.log(error)
                    throw new Error("Unknown error");
            }
        }
    }
    public modifyAudit = async (filters,auditData : UpdateAuditDto) => {
        try {
            var audit : Audit = await this.auditRepository.findOne({ where : filters});
            if(audit){
                    const updatedAudit = await this.auditRepository.save(Object.assign(audit,auditData));
                    return(updatedAudit);
            }else{
                return(null)
            }            
        } catch (error) {
            switch (error.code) {
                case "23503":
                    throw new Error("Reference is missing")
                default:
                    throw new Error("Unknown error");
            }
        }
    }
    public deleteAudit = async (id) => {
        try {
            const deletedAudit = await this.auditRepository.delete(id);
            return(deletedAudit);
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


export default AuditService;
