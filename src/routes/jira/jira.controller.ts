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
import Jira from '../jira/jira.entity';
import { FindJiraDto, CreateJiraDto, UpdateJiraDto } from '../jira/jira.dto';
import JiraService from './jira.service';


class JiraController implements Controller {
    public path = "/jira";
    public router = express.Router();
    private jiraService = new JiraService();

    constructor() {
        this.initializeRoutes()
    }

    private initializeRoutes() {
        // this.router.get(this.path, authMiddleware, permissionMiddleware(["GET EVIDENCES"]), validationMiddleware(FindEvidenceDto), this.getEvidences);
        this.router.post(this.path, authMiddleware, permissionMiddleware(["ADD JIRA"]), this.addJira);
        this.router.all(this.path + "/*", authMiddleware);
        // this.router.get(this.path + "/:id", permissionMiddleware(["GET JIRA"]), this.getJira);
        // this.router.patch(this.path + "/:id", permissionMiddleware(["MODIFY JIRA"]), validationMiddleware(UpdateJiraDto), this.modifyJira);
        // this.router.delete(this.path + "/:id", permissionMiddleware(["DELETE JIRA"]), this.deleteJira);       
    }

    
    // private findJira = async (request : express.Request, relations) => {
    //     var filterCompanies = [];
    //     this.setFilters(request, filterCompanies)
    //     const jira : Jira = await this.jiraService.getJira(filterCompanies,relations);
    //     return jira;
    // }
    private setFilters = (request: express.Request, filterCompanies) => {
        filterCompanies.push({ id: parseInt(request.params.id) });
        const secret = process.env.JWT_SECRET;
        const companies = (jwt.verify(request.header('xtoken'), secret) as DataStoredInToken).companies;
        addCompanyFilter(filterCompanies, companies);
    }

    private addJira = async (request, response: express.Response, next: express.NextFunction) => {
        try {
            const secret = process.env.JWT_SECRET;
            var jiraData = {};
            if(request.body.name){
                jiraData["name"] = request.body.name
            }else{
                next(new HttpException(400,'Name parameter is mandatory'))
                return;
            }
            if(request.body.homePath){
                jiraData["homePath"] = request.body.homePath
            }else{
                next(new HttpException(400,'HomePath parameter is mandatory'))
                return;
            }
            if(request.body.consumerKey){
                jiraData["consumerKey"] = request.body.consumerKey
            }else{
                next(new HttpException(400,'ConsumerKey parameter is mandatory'))
                return;
            }
            if(request.body.consumerPrivateKeyPath){
                jiraData["consumerPrivateKeyPath"] = request.body.consumerPrivateKeyPath
            }else{
                next(new HttpException(400,'ConsumerPrivateKeyPath parameter is mandatory'))
                return;
            }
            if(request.body.accessToken){
                jiraData["accessToken"] = request.body.accessToken
            }else{
                next(new HttpException(400,'AccessToken parameter is mandatory'))
                return;
            }
            if(request.body.description){
                jiraData["description"] = request.body.description
            }else{
                next(new HttpException(400,'Description parameter is mandatory'))
                return;
            }
        } catch (error) {
            next(new HttpException(400, error.message))
        }
    }
    
//         private getEvidence = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
//             if (!isNaN(parseInt(request.params.id))) {
//                 const evidence: Evidence = await this.findEvidence(request, ["vulnerability"]);
//                 if (evidence)
//                     response.send(evidence);
//                 else next(new HttpException(404, "Evidence does not exist"))
//             } else {
//                 next(new HttpException(400, "Id has to be a number"))
//             }
//         }
//         private modifyEvidence = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
//             var evidenceData: UpdateEvidenceDto = request.body;
//             try {
//                 var filterCompanies = [];
//                 this.setFilters(request, filterCompanies)
//                 const evidence: Evidence = await this.evidenceService.modifyEvidence(filterCompanies, evidenceData);
//                 if (evidence)
//                     response.send(evidence);
//                 else next(new HttpException(404, "Evidence does not exist"))
//             } catch (error) {
//                 next(new HttpException(400, error.message))
//             }
//         }
    
//         private deleteEvidence = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
//             if (!isNaN(parseInt(request.params.id))) {
//                 const evidence: Evidence = await this.findEvidence(request, []);
//                 if (evidence) {
//                     const result = await this.evidenceService.deleteEvidence(evidence);
//                     response.sendStatus(200);
//                 }
//                 else next(new HttpException(404, "Evidence does not exist"))
//             } else {
//                 next(new HttpException(400, "Id has to be a number"))
//             }
//         }
}

export default JiraController;
