import * as express from 'express';
import Controller from 'routes/interfaces/controller.interface';
import validationMiddleware from '../middleware/validation.middleware';
import permissionMiddleware from '../middleware/permission.middleware';
import { CreateJiraDto, UpdateJiraDto, FindJiraDto } from './jira.dto';
import JiraService from './jira.service';
import HttpException from '../exceptions/HTTPException';
import authMiddleware from '../middleware/auth.middleware';
import Jira from './jira.entity';
import * as jwt from 'jsonwebtoken';
import DataStoredInToken from '../interfaces/dataStoredInToken.interface';
import { modifyEntries, addCompanyFilter } from '../../utils/modifyEntries';



class JiraController implements Controller {
    public path = "/jira";
    public router = express.Router();
    private jiraService = new JiraService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(this.path + "/getjiraoauthrequest", authMiddleware, permissionMiddleware(["ADD JIRA"]), validationMiddleware(CreateJiraDto), this.getJiraOauthRequest);
        this.router.all(this.path + "/*", authMiddleware);
    }
    //     this.router.post(this.path + "/search", permissionMiddleware(["GET AREAS"]), validationMiddleware(FindAreaDto), this.getAreas);
    //     this.router.get(this.path + "/:id", permissionMiddleware(["GET AREAS"]), this.getArea);
    //     this.router.get(this.path + "/:id/departments", permissionMiddleware(["GET AREAS", "GET DEPARTMENTS"]), validationMiddleware(FindAreaDto), this.getAreaDepartments);
    //     this.router.get(this.path + "/:id/assets", permissionMiddleware(["GET AREAS", "GET ASSETS"]), validationMiddleware(FindAreaDto), this.getAreaAssets);
    //     this.router.patch(this.path + "/:id", permissionMiddleware(["MODIFY AREAS"]), validationMiddleware(UpdateAreaDto), this.modifyArea);
    //     this.router.delete(this.path + "/:id", permissionMiddleware(["DELETE AREAS"]), this.deleteArea);
    // }

    // private getAreas = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    //     try {
    //         const secret = process.env.JWT_SECRET;
    //         const companies = (jwt.verify(request.header('xtoken'), secret) as DataStoredInToken).companies;
    //         const filters: FindAreaDto[] = request.body.length > 0 ? request.body : []
    //         modifyEntries(filters)
    //         addCompanyFilter(filters, companies)
    //         const areas = await this.areaService.getAreas(filters, request.query.limit, request.query.offset);
    //         response.status(200).send(areas);
    //     } catch (error) {
    //         next(new HttpException(400, error.message));
    //     }
    // }
    private getJiraOauthRequest = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const secret = process.env.JWT_SECRET;

            const companies = (jwt.verify(request.header('xtoken'), secret) as DataStoredInToken).companies;
            var jiraData: CreateJiraDto = request.body;
            if (companies.indexOf(jiraData.company.id) == -1) {
                console.log("/n/n/n/n/n/nllego hasta aqui3")
                next(new HttpException(400, "User does not belong to that company"))
            } else {
                console.log("/n/n/n/n/n/nllego hasta aqui5")
                const newJira = await this.jiraService.getJiraOauthRequest(jiraData);
                console.log(newJira)
                console.log("/n/n/n/n/n/nllego hasta aqui6")
                response.status(201).send(newJira);
            }
        } catch (error) {
            console.log("/n/n/n/n/n/nllego hasta aqui7")
            next(new HttpException(400, error.message))
        }
    }
    // private modifyArea = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    //     const areaData: UpdateAreaDto = request.body;
    //     try {
    //         var filterCompanies = [];
    //         this.setFilters(request, filterCompanies)
    //         const area: Area = await this.areaService.modifyArea(request.params.id, areaData);
    //         if (area)
    //             response.status(200).send(area);
    //         else next(new HttpException(404, "Area does not exist"))
    //     } catch (error) {
    //         next(new HttpException(400, error.message))
    //     }
    // }
    private setFilters = (request: express.Request, filterCompanies) => {
        filterCompanies.push({ id: parseInt(request.params.id) });
        const secret = process.env.JWT_SECRET;
        const companies = (jwt.verify(request.header('xtoken'), secret) as DataStoredInToken).companies;
        addCompanyFilter(filterCompanies, companies);
    }
    // private findArea = async (request: express.Request, relations) => {
    //     var filterCompanies = [];
    //     this.setFilters(request, filterCompanies)
    //     const area: Area = await this.areaService.getArea(filterCompanies, relations);
    //     return area;
    // }
//     private getArea = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
//         try {
//             const area: Area = await this.findArea(request, ["company"]);
//             if (area)
//                 response.send(area);
//             else next(new HttpException(404, "Area does not exist"))
//         } catch (error) {
//             next(new HttpException(400, error.message))
//         }
//     }
//     private getAreaDepartments = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
//         try {
//             const area: Area = await this.findArea(request, ["departments"]);
//                 if (area)
//                     response.send(area.departments);
//                 else next(new HttpException(404, "Area does not exist"))
//         } catch (error) {
//             next(new HttpException(400, error.message))
//         }
//     }
//     private getAreaAssets = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
//         try {
//             const area: Area = await this.findArea(request, ["assets"]);
//              if (area)
//                  response.send(area.assets);
//              else next(new HttpException(404, "Area does not exist"))
//         } catch (error) {
//             next(new HttpException(400, error.message))
//         }
//     }
//     private deleteArea = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
//         try {
//             const result = await this.areaService.deleteArea(parseInt(request.params.id))
//             if(result.affected)
//                 response.status(200).send();
//             else next(new HttpException(404, "Area does not exist"))
//         } catch (error) {
//             next(new HttpException(400, error.message))
//         }
//     }
}

export default JiraController;
