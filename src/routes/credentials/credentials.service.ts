import { getRepository, Like } from 'typeorm';
import Credential from './credentials.entity';
import { CreateCredentialDto, FindCredentialDto, UpdateCredentialDto } from './credentials.dto';


class CredentialService {
    private credentialRepository = getRepository(Credential)

    public addCredential = async (credentialData: CreateCredentialDto) => {
        try {
            const credential = await this.credentialRepository.save(credentialData);
            return(credential)
        } catch (error) {
            switch (error.code) {
                case "42601":
                        throw new Error("Syntax error")
                case "23503":
                    throw new Error("Reference is missing")
                case "23505":
                    throw new Error("Credential already exist")
                default:
                    throw new Error("Unknown error");
            }
        }
    }

    public getCredential = async (filters,relations) => {
        try {
            const credential = await this.credentialRepository.findOne({where : filters, relations : relations});
            return (credential);
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


    

    public getCredentials = async (filters: FindCredentialDto[], limit, offset) => {
        try {
            const credentials  = await this.credentialRepository.findAndCount({ where : filters, relations : ["company"]})
            return(credentials);
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

    public modifyCredential = async (id,credentialData : UpdateCredentialDto) => {
        try {
            var credential : Credential = await this.credentialRepository.findOne(id)
            if(credential){
                const updatedCredential = await this.credentialRepository.save(Object.assign(credential,credentialData));
                return(updatedCredential)
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

    public deleteCredential = async (id) => {
        try {
            const deletedCredential = await this.credentialRepository.delete(id);
            return(deletedCredential);            
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


export default CredentialService;
