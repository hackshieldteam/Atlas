import * as express from 'express';
import Controller from 'routes/interfaces/controller.interface';
import validationMiddleware from '../middleware/validation.middleware';
import permissionMiddleware from '../middleware/permission.middleware';
import { CreateTestDto, UpdateTestDto, FindTestDto } from './test.dto';
import TestService from './test.service';
import HttpException from '../exceptions/HTTPException';
import authMiddleware from '../middleware/auth.middleware';
import Test from '../../entities/test.entity';
import Department from '../../entities/department.entity';
import Asset from '../../entities/asset.entity';
import * as jwt from 'jsonwebtoken';
import DataStoredInToken from '../interfaces/dataStoredInToken.interface';
import { modifyEntries, addCompanyFilter } from '../../utils/modifyEntries';



class TestController implements Controller {
    public path = "/tests";
    public router = express.Router();
    private testService = new TestService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(this.path, authMiddleware, permissionMiddleware(["ADD TESTS"]), validationMiddleware(CreateTestDto), this.addTest);
        this.router.all(this.path + "/*", authMiddleware);
        this.router.post(this.path + "/search", permissionMiddleware(["GET TESTS"]), validationMiddleware(FindTestDto), this.getTests);
        this.router.get(this.path + "/:id", permissionMiddleware(["GET TESTS"]), this.getTest);
        this.router.patch(this.path + "/:id", permissionMiddleware(["MODIFY TESTS"]), validationMiddleware(UpdateTestDto), this.modifyTest);
        this.router.delete(this.path + "/:id", permissionMiddleware(["DELETE TESTS"]), this.deleteTest);
    }

    private getTests = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const secret = process.env.JWT_SECRET;
            const companies = (jwt.verify(request.header('xtoken'), secret) as DataStoredInToken).companies;
            const filters: FindTestDto[] = request.body.length > 0 ? request.body : []
            modifyEntries(filters)
            addCompanyFilter(filters, companies)
            const tests = await this.testService.getTests(filters, request.query.limit, request.query.offset);
            response.status(200).send(tests);
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    }
    private addTest = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const secret = process.env.JWT_SECRET;
            const companies = (jwt.verify(request.header('xtoken'), secret) as DataStoredInToken).companies;
            var testData: CreateTestDto = request.body;
            if (companies.indexOf(testData.company.id) == -1) {
                next(new HttpException(400, "User does not belong to that company"))
            } else {
                const newTest = await this.testService.addTest(testData);
                response.status(201).send(newTest);
            }
        } catch (error) {
            next(new HttpException(400, error.message))
        }
    }
    private modifyTest = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const testData: UpdateTestDto = request.body;
        try {
            var filterCompanies = [];
            this.setFilters(request, filterCompanies)
            const test: Test = await this.testService.modifyTest(request.params.id, testData);
            if (test)
                response.status(200).send(test);
            else next(new HttpException(404, "Test does not exist"))
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
    private findTest = async (request: express.Request, relations) => {
        var filterCompanies = [];
        this.setFilters(request, filterCompanies)
        const test: Test = await this.testService.getTest(filterCompanies, relations);
        return test;
    }
    private getTest = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const test: Test = await this.findTest(request, ["company"]);
            if (test)
                response.send(test);
            else next(new HttpException(404, "Test does not exist"))
        } catch (error) {
            next(new HttpException(400, error.message))
        }
    }
    private deleteTest = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const result = await this.testService.deleteTest(parseInt(request.params.id))
            if(result.affected)
                response.status(200).send();
            else next(new HttpException(404, "Test does not exist"))
        } catch (error) {
            next(new HttpException(400, error.message))
        }
    }
}

export default TestController;
