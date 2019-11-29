import Controller from "../interfaces/controller.interface";
import * as express from 'express';
import authMiddleware from "../middleware/auth.middleware";
import { CreateMethodologyDto, UpdateMethodologyDto, FindMethodologyDto } from "./methodology.dto";
import validationMiddleware from '../middleware/validation.middleware';
import permissionMiddleware from '../middleware/permission.middleware';
import { request } from "https";
import HttpException from "../exceptions/HTTPException";
import { modifyEntries, addCompanyFilter } from "../../utils/modifyEntries";
import * as jwt from 'jsonwebtoken';
import DataStoredInToken from '../interfaces/dataStoredInToken.interface';
import MethodologyService from "./methodology.service";
import Methodology from "../../entities/methodology.entity";




class MethodologyController implements Controller{
    public path ="/methodologies";
    public router = express.Router()
    private methodologyService = new MethodologyService()


    constructor(){
        this.initializeRoutes()
    }

    private initializeRoutes() {
        this.router.post(this.path, authMiddleware, permissionMiddleware(["ADD METHODOLOGIES"]), this.addMethodology);
        this.router.all(this.path + "/*", authMiddleware);
        this.router.post(this.path + "/search", permissionMiddleware(["GET METHODOLOGIES"]), validationMiddleware(FindMethodologyDto), this.getMethodologies);
        this.router.get(this.path + "/:id", permissionMiddleware(["GET METHODOLOGIES"]), this.getMethodology);
        this.router.get(this.path + "/:id/departments", permissionMiddleware(["GET METHODOLOGIES", "GET TESTS"]), validationMiddleware(FindMethodologyDto), this.getMethodologyTests);
        this.router.patch(this.path + "/:id", permissionMiddleware(["MODIFY METHODOLOGIES"]), validationMiddleware(UpdateMethodologyDto), this.modifyMethodology);
        this.router.delete(this.path + "/:id", permissionMiddleware(["DELETE METHODOLOGIES"]), this.deleteMethodology);
       }


    private getMethodologies = async (request : express.Request, response : express.Response,next: express.NextFunction) => {
        try {
            const secret = process.env.JWT_SECRET;
            const companies = (jwt.verify(request.header('xtoken'), secret) as DataStoredInToken).companies;
            const filters: FindMethodologyDto[] = request.body.length > 0 ? request.body : []
            modifyEntries(filters)
            addCompanyFilter(filters,companies)
            const methodologies = await this.methodologyService.getMethodologies(filters,request.query.limit,request.query.offset);
            response.status(200).send(methodologies)            
        } catch (error) {

            next(new HttpException(400,error.message))
        }
    }


    private addMethodology = async (request : express.Request, response : express.Response,next : express.NextFunction) => {
        try {
            const secret = process.env.JWT_SECRET;
            const companies = (jwt.verify(request.header('xtoken'), secret) as DataStoredInToken).companies;
            var methodologyData : CreateMethodologyDto = request.body
            if (companies.indexOf(methodologyData.company.id) == -1) {
                next(new HttpException(400, "User does not belong to that company"))
            } else {
                const newMethodology = await this.methodologyService.addMethodology(methodologyData);
                response.status(200).send(newMethodology);
            }
        } catch (error) {
            next(new HttpException(400,error.message))
        }
    }

    private modifyMethodology = async ( request : express.Request, response : express.Response, next : express.NextFunction) => {
        const methodologyData : UpdateMethodologyDto = request.body
        try {
            var filterCompanies = [];
            this.setFilters(request,filterCompanies)
            const methodology : Methodology = await this.methodologyService.modifyMethodology(request.params.id,methodologyData)
            if(methodology)
                response.status(201).send(methodology)
            else next(new HttpException(404, "Methodology does not exist"))
        } catch (error) {
            next(new HttpException(400,error.message))
        }
    }

    private setFilters = (request: express.Request, filterCompanies) => {
        filterCompanies.push({ id: parseInt(request.params.id) });
        const secret = process.env.JWT_SECRET;
        const companies = (jwt.verify(request.header('xtoken'), secret) as DataStoredInToken).companies;
        addCompanyFilter(filterCompanies, companies);
    }
    

    private findMethodology = async (request: express.Request, relations) => {
        var filterCompanies = [];
        this.setFilters(request, filterCompanies)
        const methodology: Methodology = await this.methodologyService.getMethodology(filterCompanies, relations);
        return methodology;
    }

private getMethodology = async (request : express.Request,response : express.Response, next : express.NextFunction) => {
    try {
        const methodology : Methodology = await this.findMethodology(request,["tests"])
        if(methodology){
            response.send(methodology)
        }else next(new HttpException(404,"Methodology does not exist"));
    } catch (error) {
        next(new HttpException(400, error.message))
    }
}

private getMethodologyTests = async (request : express.Request,response : express.Response, next : express.NextFunction) => {
    try {
        const methodology : Methodology = await this.findMethodology(request,["tests"])
        if(methodology){
            response.status(200).send(methodology.tests)
        }else  next(new HttpException(404, "Methodology does not exist"))
    } catch (error) {
        next(new HttpException(400, error.message))
    }
}


private deleteMethodology = async (request : express.Request,response : express.Response, next : express.NextFunction) => {
    try {
        const result = await this.methodologyService.deleteMethodology(parseInt(request.params.id))
        if(result.affected)
            response.status(200).send();
        else next(new HttpException(404, "Methodology does not exist"))
    } catch (error) {
        next(new HttpException(400, error.message))
    }
}

}


export default MethodologyController;
