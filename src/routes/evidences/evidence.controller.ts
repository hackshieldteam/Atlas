import * as express from 'express';
import Controller from 'routes/interfaces/controller.interface';
import validationMiddleware from '../middleware/validation.middleware';
import permissionMiddleware from '../middleware/permission.middleware';
import { getRepository } from 'typeorm';
import HttpException from '../exceptions/HTTPException';
import authMiddleware from '../middleware/auth.middleware';
import * as jwt from 'jsonwebtoken';
import { modifyEntries, addCompanyFilter } from '../../utils/modifyEntries';
import DataStoredInToken from '../interfaces/dataStoredInToken.interface';
import Evidence from './evidence.entity';


const crypto = require('crypto');
const secret = 'abcdefg';



import { FindEvidenceDto, CreateEvidenceDto, UpdateEvidenceDto } from './evidence.dto';
import EvidenceService from './evidence.service';


const fileType = require('file-type');

class EvidenceController implements Controller {
    public path = "/evidences";
    public router = express.Router();
    private evidenceService = new EvidenceService();

    constructor() {
        this.initializeRoutes()
    }

    private initializeRoutes() {
        // this.router.get(this.path, authMiddleware, permissionMiddleware(["GET EVIDENCES"]), validationMiddleware(FindEvidenceDto), this.getEvidences);
        this.router.post(this.path, authMiddleware, permissionMiddleware(["ADD EVIDENCES"]), this.addEvidence);
        this.router.all(this.path + "/*", authMiddleware);
        this.router.get(this.path + "/:id", permissionMiddleware(["GET EVIDENCES"]), this.getEvidence);
        this.router.patch(this.path + "/:id", permissionMiddleware(["MODIFY EVIDENCES"]), validationMiddleware(UpdateEvidenceDto), this.modifyEvidence);
        this.router.delete(this.path + "/:id", permissionMiddleware(["DELETE EVIDENCES"]), this.deleteEvidence);       
    }

    
        private findEvidence = async (request : express.Request, relations) => {
            var filterCompanies = [];
            this.setFilters(request, filterCompanies)
            const evidence : Evidence = await this.evidenceService.getEvidence(filterCompanies,relations);
            return evidence;
        }
    private setFilters = (request: express.Request, filterCompanies) => {
        filterCompanies.push({ id: parseInt(request.params.id) });
        const secret = process.env.JWT_SECRET;
        const companies = (jwt.verify(request.header('xtoken'), secret) as DataStoredInToken).companies;
        addCompanyFilter(filterCompanies, companies);
    }
    /*
        private getEvidences = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
            try {
                const cookies = request.cookies;
                const secret = process.env.JWT_SECRET;
                const filters: FindEvidenceDto[] = request.body.length > 0 ? request.body : []
                modifyEntries(filters)
                const companies = (jwt.verify(cookies.Authorization, secret) as DataStoredInToken).companies;
                addCompanyFilter(filters, companies)
                const evidences = await this.evidenceService.getEvidences(filters, request.query.limit, request.query.offset);
                response.send(evidences);
            } catch (error) {
                next(new HttpException(400, error.message));
            }
        }*/

    private addEvidence = async (request, response: express.Response, next: express.NextFunction) => {
        try {
            const secret = process.env.JWT_SECRET;
            var evidenceData = {};
            if(request.body.description){
                evidenceData["description"] = request.body.description
            }else{
                next(new HttpException(400,'Description parameter is mandatory'))
                return;
            }
            if(request.body.company){
                evidenceData["company"] = request.body.company
            }else{
                next(new HttpException(400,'Company parameter is mandatory'))
                return;
            }
            if(request.body.class){
                evidenceData["class"] = request.body.class
            }else{
                next(new HttpException(400,'Class parameter is mandatory'))
                return;
            }
            if(request.body.vulnerability){
                evidenceData["vulnerability"] = request.body.vulnerability
            }else{
                next(new HttpException(400,'Vulnerability parameter is mandatory'))
                return;
            }
            if (request.files.evidence) {
                if (fileType(request.files.evidence.data)) {
                    const hash = crypto.createHmac('sha256', secret)
                           .update(request.files.evidence.data)
                           .digest('hex');
                    evidenceData["hash"] = hash
                    const companies = (jwt.verify(request.header('xtoken'), secret) as DataStoredInToken).companies;
                    evidenceData["evidence"] = request.files.evidence
                    if (companies.indexOf(parseInt(evidenceData["company"])) == -1) {
                        next(new HttpException(400, "User does not belong to that company"))
                    } else {
                        const newEvidence = await this.evidenceService.addEvidence(evidenceData);
                        response.status(201).send(newEvidence);
                    }
                } else {
                    next(new HttpException(400, "File type not supported"))
                }
            } else {
                next(new HttpException(400, "It is mandatory to send a file"))
            }
        } catch (error) {
            next(new HttpException(400, error.message))
        }
    }
    
        private getEvidence = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
            if (!isNaN(parseInt(request.params.id))) {
                const evidence: Evidence = await this.findEvidence(request, ["vulnerability"]);
                if (evidence)
                    response.send(evidence);
                else next(new HttpException(404, "Evidence does not exist"))
            } else {
                next(new HttpException(400, "Id has to be a number"))
            }
        }
        private modifyEvidence = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
            var evidenceData: UpdateEvidenceDto = request.body;
            try {
                var filterCompanies = [];
                this.setFilters(request, filterCompanies)
                const evidence: Evidence = await this.evidenceService.modifyEvidence(filterCompanies, evidenceData);
                if (evidence)
                    response.send(evidence);
                else next(new HttpException(404, "Evidence does not exist"))
            } catch (error) {
                next(new HttpException(400, error.message))
            }
        }
    
        private deleteEvidence = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
            if (!isNaN(parseInt(request.params.id))) {
                const evidence: Evidence = await this.findEvidence(request, []);
                if (evidence) {
                    const result = await this.evidenceService.deleteEvidence(evidence);
                    response.sendStatus(200);
                }
                else next(new HttpException(404, "Evidence does not exist"))
            } else {
                next(new HttpException(400, "Id has to be a number"))
            }
        }
}

export default EvidenceController;
