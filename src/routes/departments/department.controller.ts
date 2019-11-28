import * as express from 'express';
import Controller from 'routes/interfaces/controller.interface';
import validationMiddleware from '../middleware/validation.middleware';
import permissionMiddleware from '../middleware/permission.middleware';
import { CreateDepartmentDto, UpdateDepartmentDto, FindDepartmentDto } from './department.dto';
import { getRepository } from 'typeorm';
import DepartmentService from './department.service';
import HttpException from '../exceptions/HTTPException';
import authMiddleware from '../middleware/auth.middleware';
import * as bcrypt from 'bcrypt';
import Area from '../areas/area.entity';
import Department from './department.entity';
import Asset from '../assets/asset.entity';



class DepartmentController implements Controller {
    public path = "/departments";
    public router = express.Router();
    private departmentService = new DepartmentService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
/*        this.router.get(this.path,authMiddleware,permissionMiddleware(["GET AREAS"]),this.getAreas);
        this.router.post(this.path,/*authMiddleware ,permissionMiddleware(["ADD AREAS"]),validationMiddleware(CreateAreaDto), this.addArea);
        this.router.all(this.path + "/*", authMiddleware);
        this.router.get(this.path + "/:id",permissionMiddleware(["GET AREAS"]), this.getArea);
        this.router.get(this.path + "/:id/departments",permissionMiddleware(["GET AREAS","GET DEPARTMENTS"]), this.getAreaDepartments);
        this.router.get(this.path + "/:id/assets",permissionMiddleware(["GET AREAS","GET ASSETS"]), this.getAreaAssets);
        this.router.patch(this.path + "/:id",permissionMiddleware(["MODIFY AREAS"]), validationMiddleware(UpdateAreaDto), this.modifyArea);
        this.router.delete(this.path + "/:id",permissionMiddleware(["DELETE AREAS"]), this.deleteArea);
   */
  this.router.get(this.path,validationMiddleware(FindDepartmentDto), this.getDepartments);
  this.router.post(this.path,validationMiddleware(CreateDepartmentDto), this.addDepartment);
  this.router.get(this.path + "/:id", this.getDepartment);
  this.router.get(this.path + "/:id/assets", this.getDepartmentAssets);
  this.router.patch(this.path + "/:id", validationMiddleware(UpdateDepartmentDto), this.modifyDepartment);
  this.router.delete(this.path + "/:id", this.deleteDepartment);
    }

    private getDepartments = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const filters : FindDepartmentDto[] = request.body;
            const departments = await this.departmentService.getDepartments(filters, request.query.limit, request.query.offset);
            response.send(departments);
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    }

    private addDepartment = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            var departmentData: CreateDepartmentDto = request.body;
            const newDepartment = await this.departmentService.addDepartment(departmentData);
            response.send(newDepartment);
        } catch (error) {
            next(new HttpException(400, error.message))
        }
    }


    private modifyDepartment = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        if (!isNaN(parseInt(request.params.id))) {
            var departmentData: UpdateDepartmentDto = request.body;
                try {
                    const department: Department = await this.departmentService.modifyDepartment(parseInt(request.params.id), departmentData);
                    if (department)
                        response.send(department);
                    else next(new HttpException(404, "Department does not exist"))
                } catch (error) {
                    next(new HttpException(400, error.message))
                }
        } else {
            next(new HttpException(400, "Id has to be a number"))
        }
    }

    private getDepartment = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        if (!isNaN(parseInt(request.params.id))) {
            const department : Department = await this.departmentService.getDepartment(parseInt(request.params.id));
            if (department)
                response.send(department);
            else next(new HttpException(404, "Department does not exist"))
        } else {
            next(new HttpException(400, "Id has to be a number"))
        }
    }



    private getDepartmentAssets = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        if (!isNaN(parseInt(request.params.id))) {
            const assets : Asset[] = await this.departmentService.getDepartmentAssets(parseInt(request.params.id));
            if (assets)
                response.send(assets);
            else next(new HttpException(404, "Department does not exist"))
        } else {
            next(new HttpException(400, "Id has to be a number"))
        }
    }

    private deleteDepartment = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        if (!isNaN(parseInt(request.params.id))) {
            const result = await this.departmentService.deleteDepartment(parseInt(request.params.id));
            if (result.affected!=0)
                response.sendStatus(204);
            else next(new HttpException(404, "Department does not exist"))
        } else {
            next(new HttpException(400, "Id has to be a number"))
        }
    }


}

export default DepartmentController;
