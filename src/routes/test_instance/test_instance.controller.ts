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
import TestInstanceService from './test_instance.service';
import Test_Instance from 'entities/test_instance.entity';
import { CreateTestInstanceDto, FindTestInstanceDto, UpdateTestInstanceDto } from './test_instance.dto';



class TestInstanceController implements Controller {
    public path = "/testInstances";
    public router = express.Router();
    private testInstanceService = new TestInstanceService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(this.path, authMiddleware, permissionMiddleware(["ADD AREAS"]), validationMiddleware(CreateTestInstanceDto), this.addTestInstance);
        this.router.all(this.path + "/*", authMiddleware);
        this.router.post(this.path + "/search", permissionMiddleware(["GET AREAS"]), validationMiddleware(FindTestInstanceDto), this.getTestInstances);
        this.router.get(this.path + "/:id", permissionMiddleware(["GET AREAS"]), this.getTestInstance);
        this.router.patch(this.path + "/:id", permissionMiddleware(["MODIFY AREAS"]), validationMiddleware(UpdateTestInstanceDto), this.modifyTestInstance);
        this.router.delete(this.path + "/:id", permissionMiddleware(["DELETE AREAS"]), this.deleteTestInstance);
    }

    private getTestInstances = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const secret = process.env.JWT_SECRET;
            const companies = (jwt.verify(request.header('xtoken'), secret) as DataStoredInToken).companies;
            const filters: FindTestInstanceDto[] = request.body.length > 0 ? request.body : []
            modifyEntries(filters)
            addCompanyFilter(filters, companies)
            const testInstances = await this.testInstanceService.getTestInstances(filters, request.query.limit, request.query.offset);
            response.status(200).send(testInstances);
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    }
    private addTestInstance = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const secret = process.env.JWT_SECRET;
            const companies = (jwt.verify(request.header('xtoken'), secret) as DataStoredInToken).companies;
            var testInstanceData: CreateTestInstanceDto = request.body;
            if (companies.indexOf(testInstanceData.company.id) == -1) {
                next(new HttpException(400, "User does not belong to that company"))
            } else {
                const newTestInstance = await this.testInstanceService.addTestInstance(testInstanceData);
                response.status(201).send(newTestInstance);
            }
        } catch (error) {
            next(new HttpException(400, error.message))
        }
    }
    private modifyTestInstance = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const testInstanceData: UpdateTestInstanceDto = request.body;
        try {
            var filterCompanies = [];
            this.setFilters(request, filterCompanies)
            const testInstance: Test_Instance = await this.testInstanceService.modifyTestInstance(request.params.id, testInstanceData);
            if (testInstance)
                response.status(200).send(testInstance);
            else next(new HttpException(404, "TestInstance does not exist"))
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
    private findTestInstance = async (request: express.Request, relations) => {
        var filterCompanies = [];
        this.setFilters(request, filterCompanies)
        const testInstance: Test_Instance = await this.testInstanceService.getTestInstance(filterCompanies, relations);
        return testInstance;
    }
    private getTestInstance = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const testInstance: Test_Instance = await this.findTestInstance(request, ["company"]);
            if (testInstance)
                response.send(testInstance);
            else next(new HttpException(404, "TestInstance does not exist"))
        } catch (error) {
            next(new HttpException(400, error.message))
        }
    }

    private deleteTestInstance = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const result = await this.testInstanceService.deleteTestInstance(parseInt(request.params.id))
            if(result.affected)
                response.status(200).send();
            else next(new HttpException(404, "TestInstance does not exist"))
        } catch (error) {
            next(new HttpException(400, error.message))
        }
    }
}

export default TestInstanceController;
