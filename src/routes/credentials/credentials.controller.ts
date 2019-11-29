import * as express from 'express';
import Controller from 'routes/interfaces/controller.interface';
import validationMiddleware from '../middleware/validation.middleware';
import permissionMiddleware from '../middleware/permission.middleware';
import HttpException from '../exceptions/HTTPException';
import authMiddleware from '../middleware/auth.middleware';
import Department from '../../entities/department.entity';
import Asset from '../../entities/asset.entity';
import * as jwt from 'jsonwebtoken';
import DataStoredInToken from '../interfaces/dataStoredInToken.interface';
import { modifyEntries, addCompanyFilter } from '../../utils/modifyEntries';
import { CreateCredentialDto, FindCredentialDto, UpdateCredentialDto } from './credentials.dto';
import Credential from '../../entities/credentials.entity';
import CredentialService from './credentials.service';



class CredentialController implements Controller {
    public path = "/credentials";
    public router = express.Router();
    private credentialService = new CredentialService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(this.path, authMiddleware, permissionMiddleware(["ADD CREDENTIALS"]), validationMiddleware(CreateCredentialDto), this.addCredential);
        this.router.all(this.path + "/*", authMiddleware);
        this.router.post(this.path + "/search", permissionMiddleware(["GET CREDENTIALS"]), validationMiddleware(FindCredentialDto), this.getCredentials);
        this.router.get(this.path + "/:id", permissionMiddleware(["GET CREDENTIALS"]), this.getCredential);
        this.router.patch(this.path + "/:id", permissionMiddleware(["MODIFY CREDENTIALS"]), validationMiddleware(UpdateCredentialDto), this.modifyCredential);
        this.router.delete(this.path + "/:id", permissionMiddleware(["DELETE CREDENTIALS"]), this.deleteCredential);
    }

    private getCredentials = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const secret = process.env.JWT_SECRET;
            const companies = (jwt.verify(request.header('xtoken'), secret) as DataStoredInToken).companies;
            const filters: FindCredentialDto[] = request.body.length > 0 ? request.body : []
            modifyEntries(filters)
            addCompanyFilter(filters, companies)
            const credentials = await this.credentialService.getCredentials(filters, request.query.limit, request.query.offset);
            response.status(200).send(credentials);
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    }
    private addCredential = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const secret = process.env.JWT_SECRET;
            const companies = (jwt.verify(request.header('xtoken'), secret) as DataStoredInToken).companies;
            var credentialData: CreateCredentialDto = request.body;
            if (companies.indexOf(credentialData.company.id) == -1) {
                next(new HttpException(400, "User does not belong to that company"))
            } else {
                const newCredential = await this.credentialService.addCredential(credentialData);
                response.status(201).send(newCredential);
            }
        } catch (error) {
            next(new HttpException(400, error.message))
        }
    }
    private modifyCredential = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const credentialData: UpdateCredentialDto = request.body;
        try {
            var filterCompanies = [];
            this.setFilters(request, filterCompanies)
            const credential: Credential = await this.credentialService.modifyCredential(request.params.id, credentialData);
            if (credential)
                response.status(200).send(credential);
            else next(new HttpException(404, "Credential does not exist"))
        } catch (error) {
            next(new HttpException(400, error.message))
        }
    }
    private setFilters = (request: express.Request, filterCompanies) => {
        filterCompanies.push({ id: parseInt(request.params.id) });
        const secret = process.env.JWT_SECRET;
        const companies = (jwt.verify(request.header('xtoken'), secret) as DataStoredInToken).companies;
        addCompanyFilter(filterCompanies, companies);
    }
    private findCredential = async (request: express.Request, relations) => {
        var filterCompanies = [];
        this.setFilters(request, filterCompanies)
        const credential: Credential = await this.credentialService.getCredential(filterCompanies, relations);
        return credential;
    }
    private getCredential = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const credential: Credential = await this.findCredential(request, ["company"]);
            if (credential)
                response.send(credential);
            else next(new HttpException(404, "Credential does not exist"))
        } catch (error) {
            next(new HttpException(400, error.message))
        }
    }
    private deleteCredential = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const result = await this.credentialService.deleteCredential(parseInt(request.params.id))
            if(result.affected)
                response.status(200).send();
            else next(new HttpException(404, "Credential does not exist"))
        } catch (error) {
            next(new HttpException(400, error.message))
        }
    }
}

export default CredentialController;
