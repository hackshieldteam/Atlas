import { getRepository } from 'typeorm';
import Evidence from './evidence.entity';
import { CreateEvidenceDto, UpdateEvidenceDto } from './evidence.dto';
import * as fileType from 'file-type';
import * as multer from 'multer'
import Vulnerability from '../vulnerabilities/vulnerability.entity';
import HttpException from '../exceptions/HTTPException';
import * as fs from 'fs';


var upload = multer({ dest: './' })

function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return  Buffer.from(bitmap).toString('base64');
}

function base64_decode(base64str, file) {
    // create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
    var bitmap = new Buffer(base64str, 'base64');
    // write buffer to file
    fs.writeFileSync(file, bitmap);
    console.log('******** File created from base64 encoded string ********');
}


class EvidenceService {

    private evidenceRepository = getRepository(Evidence)
    private vulnerabilityRepository = getRepository(Vulnerability)

    public addEvidence = async (evidenceData) => {
        try {
            var vulnerability: Vulnerability = await this.vulnerabilityRepository.findOne({ where: { id: evidenceData.vulnerability, company: evidenceData.company }, relations: ["evidences"] })
            if (vulnerability) {
                evidenceData.evidence.mv("./" + evidenceData.hash, function (err) {
                    if (err) {
                        throw new HttpException(500, "Error during file upload")
                    }
                })
                var evidence = new Evidence()
                evidence.path = evidenceData.hash;
                evidence.description = evidenceData.description;
                evidence.class = evidenceData.class
                vulnerability.evidences.push(evidence)
                const result = await this.vulnerabilityRepository.save(vulnerability)
                return (result);
            } else {
                throw new HttpException(404, "Vulnerability not found")
            }
        } catch (error) {
            throw error
        }
    }
    public getEvidence = async (filters,relations) => {
        try {
            const evidence = await this.evidenceRepository.findOne({ where : filters, relations : relations});
            if(evidence){
                //const file = fs.readFileSync(evidence.path,{ encoding : "utf8"});
                evidence["file"] = base64_encode(evidence.path);
                return (evidence)    
            }else return null;
        } catch (error) {
            throw error
        }
    }
    public deleteEvidence = async (evidence : Evidence) => {
        const result = this.evidenceRepository.delete(evidence.id)
        fs.unlink(evidence.path, (err) => {
            if(err){
                throw err;
            }
        })
        return result;
    }
    public modifyEvidence = async (filters,evidenceData : UpdateEvidenceDto) => {
        const evidence : Evidence = await this.evidenceRepository.findOne({where:filters})
        if(evidence){
            try {
                const updatedEvidence = await this.evidenceRepository.save(Object.assign(evidence,evidenceData))
                return updatedEvidence
            } catch (error) {
                switch (error.code) {
                    case "23503":
                        throw new Error("Reference is missing")
                    default:
                        throw new Error("Unknown error");
                }
            }
        }else{
            return null;
        }
    }

}

export default EvidenceService;
