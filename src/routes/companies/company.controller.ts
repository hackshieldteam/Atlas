import * as express from 'express';
import Controller from 'routes/interfaces/controller.interface';
import validationMiddleware from '../middleware/validation.middleware';
import authMiddleware from '../middleware/auth.middleware';
import permissionMiddelware from '../middleware/permission.middleware'
import { CreateCompanyDto, UpdateCompanyDto, FindCompanyDto } from './company.dto';
import Company from './company.entity';
import CompanyService from './company.service';
import HttpException from '../exceptions/HTTPException';
import Area from '../areas/area.entity';
import Group from '../groups/group.entity';
import { modifyEntries } from '../../utils/modifyEntries';

class CompanyController implements Controller {
    public path = "/companies"
    public router = express.Router();
    private companyService = new CompanyService();

    constructor() {
        this.initializeRoutes();
    }




    private initializeRoutes() {
        this.router.post(this.path, authMiddleware, permissionMiddelware(["ADD COMPANIES"]), validationMiddleware(CreateCompanyDto), this.addCompany);
        this.router.all(this.path + "/*", authMiddleware);
        this.router.post(this.path + "/search", permissionMiddelware(["GET COMPANIES"]), validationMiddleware(FindCompanyDto), this.getCompanies);
        this.router.get(this.path + "/:id", permissionMiddelware(["GET COMPANIES"]), this.getCompany);
        this.router.get(this.path + "/:id/areas", permissionMiddelware(["GET COMPANIES", "GET AREAS"]), this.getCompanyAreas);
        this.router.get(this.path + "/:id/groups", permissionMiddelware(["GET COMPANIES", "GET GROUPS"]), this.getCompanyGroups);
        this.router.patch(this.path + "/:id", permissionMiddelware(["MODIFY COMPANIES"]), validationMiddleware(UpdateCompanyDto), this.modifyCompany);
        this.router.delete(this.path + "/:id", permissionMiddelware(["DELETE COMPANIES"]), this.deleteCompany);
    }

    private getCompanies = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const filters: FindCompanyDto[] = request.body.length > 0 ? request.body : []
            modifyEntries(filters)
            const companies = await this.companyService.getCompanies(filters, request.query.limit, request.query.offset);
            response.status(200).send(companies);
        } catch (error) {
            next(new HttpException(400, error.message));
        }

    }

    private addCompany = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const companyData: CreateCompanyDto = request.body;
            const newCompany = await this.companyService.addCompany(companyData);
            response.status(201).send(newCompany);
        } catch (error) {
            next(new HttpException(400, error.message))
        }
    }

    private modifyCompany = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            var companyData: UpdateCompanyDto = request.body;
            const company: Company = await this.companyService.modifyCompany(request.params.id, companyData);
            if (company) {
                response.status(200).send(company);
            }
            else {
                next(new HttpException(404, "Company does not exist"))
            }
        } catch (error) {
            next(new HttpException(400, error.message))
        }
    }

    private getCompany = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const company: Company = await this.companyService.getCompany(parseInt(request.params.id));
            if (company)
                response.send(company);
            else next(new HttpException(404, "Company does not exist"))
        } catch (error) {
            next(new HttpException(400, error.message))
        }
    }

    private getCompanyAreas = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const areas: Area[] = await this.companyService.getCompanyAreas(parseInt(request.params.id));
            if (areas)
                response.send(areas);
            else next(new HttpException(404, "Company does not exist"))
        } catch (error) {
            next(new HttpException(400, error.message))
        }
    }

    private getCompanyGroups = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const groups: Group[] = await this.companyService.getCompanyGroups(parseInt(request.params.id));
            if (groups)
                response.send(groups);
            else next(new HttpException(404, "Company does not exist"))
        } catch (error) {
            next(new HttpException(400, error.message))
        }
    }

    private deleteCompany = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const result = await this.companyService.deleteCompany(parseInt(request.params.id));
            if (result.affected)
                response.status(200).send();
            else next(new HttpException(404, "Company does not exist"))
        } catch (error) {
            next(new HttpException(400, error.message))
        }
    }
}

export default CompanyController;
