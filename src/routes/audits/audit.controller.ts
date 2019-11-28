import * as express from 'express';
import Controller from 'routes/interfaces/controller.interface';
import validationMiddleware from '../middleware/validation.middleware';
import permissionMiddleware from '../middleware/permission.middleware';
import { CreateAuditDto, UpdateAuditDto, FindAuditDto } from './audit.dto';
import { getRepository } from 'typeorm';
import AuditService from './audit.service';
import HttpException from '../exceptions/HTTPException';
import authMiddleware from '../middleware/auth.middleware';
import * as bcrypt from 'bcrypt';
import Audit from './audit.entity';
import Vulnerability from 'routes/vulnerabilities/vulnerability.entity';
import * as jwt from 'jsonwebtoken';
import { modifyEntries, addCompanyFilter } from '../../utils/modifyEntries';
import DataStoredInToken from '../interfaces/dataStoredInToken.interface';


class AuditController implements Controller {
    public path = "/audits";
    public router = express.Router();
    private auditService = new AuditService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(this.path, authMiddleware, permissionMiddleware(["ADD AUDITS"]), validationMiddleware(CreateAuditDto), this.addAudit);
        this.router.all(this.path + "/*", authMiddleware);
        this.router.post(this.path + "/search", permissionMiddleware(["GET AUDITS"]), validationMiddleware(FindAuditDto), this.getAudits);
        this.router.get(this.path + "/:id", permissionMiddleware(["GET AUDITS"]), this.getAudit);
        this.router.get(this.path + "/:id/vulnerabilities", permissionMiddleware(["GET AUDITS", "GET VULNERABILITIES"]), this.getAuditVulnerabilities);
        this.router.patch(this.path + "/:id", permissionMiddleware(["MODIFY AUDITS"]), validationMiddleware(UpdateAuditDto), this.modifyAudit);
        this.router.delete(this.path + "/:id", permissionMiddleware(["DELETE AUDITS"]), this.deleteAudit);
    }

    private getAudits = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const secret = process.env.JWT_SECRET;
            const filters: FindAuditDto[] = request.body.length > 0 ? request.body : []
            modifyEntries(filters)
            const companies = (jwt.verify(request.header('xtoken'), secret) as DataStoredInToken).companies;
            addCompanyFilter(filters, companies)
            const audits = await this.auditService.getAudits(filters, request.query.limit, request.query.offset);
            response.send(audits);
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    }
    private addAudit = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const secret = process.env.JWT_SECRET;
            const companies = (jwt.verify(request.header('xtoken'), secret) as DataStoredInToken).companies;
            var auditData: CreateAuditDto = request.body;
            if (companies.indexOf(auditData.company.id) == -1) {
                next(new HttpException(400, "User does not belong to that company"))
            } else {
                const newAudit = await this.auditService.addAudit(auditData);
                response.status(201).send(newAudit);
            }
        } catch (error) {
            next(new HttpException(400, error.message))
        }
    }
    private modifyAudit = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        var auditData: UpdateAuditDto = request.body;
        try {
            var filterCompanies = [];
            this.setFilters(request, filterCompanies)
            const audit: Audit = await this.auditService.modifyAudit(filterCompanies, auditData);
            if (audit)
                response.send(audit);
            else next(new HttpException(404, "Audit does not exist"))
        } catch (error) {
            next(new HttpException(400, error.message))
        }
    }
    private getAudit = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const audit: Audit = await this.findAudit(request, ["vulnerabilities", "url"]);
            if (audit)
                response.send(audit);
            else next(new HttpException(404, "Audit does not exist"))
        } catch (error) {
            next(new HttpException(400, error.message))
        }
    }
    private getAuditVulnerabilities = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const audit: Audit = await this.findAudit(request, ["vulnerabilities"]);
                if (audit)
                    response.send(audit.vulnerabilities);
                else next(new HttpException(404, "Audit does not exist"))
        } catch (error) {
            next(new HttpException(400, error.message))
        }
        
    }
    private deleteAudit = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const audit: Audit = await this.findAudit(request, []);
                if (audit) {
                    const result = await this.auditService.deleteAudit(request.params.id)
                    response.sendStatus(200);
                } else next(new HttpException(404, "Audit does not exist"))
        } catch (error) {
            next(new HttpException(400, error.message))
        }
    }
    private findAudit = async (request: express.Request, relations) => {
        var filterCompanies = [];
        this.setFilters(request, filterCompanies)
        const audit: Audit = await this.auditService.getAudit(filterCompanies, relations);
        return audit;
    }
    private setFilters = (request: express.Request, filterCompanies) => {
        filterCompanies.push({ id: parseInt(request.params.id) });
        const secret = process.env.JWT_SECRET;
        const companies = (jwt.verify(request.header('xtoken'), secret) as DataStoredInToken).companies;
        addCompanyFilter(filterCompanies, companies);
    }
}

export default AuditController;
