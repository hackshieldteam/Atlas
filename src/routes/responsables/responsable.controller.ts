import * as express from 'express';
import Controller from 'routes/interfaces/controller.interface';
import validationMiddleware from '../middleware/validation.middleware';
import permissionMiddleware from '../middleware/permission.middleware';
import { CreateResponsableDto, UpdateResponsableDto, FindResponsableDto } from './responsable.dto';
import ResponsableService from './responsable.service';
import HttpException from '../exceptions/HTTPException';
import authMiddleware from '../middleware/auth.middleware';
import Responsable from '../../entities/responsable.entity';



class ResponsableController implements Controller {
    public path = "/responsables";
    public router = express.Router();
    private responsableService = new ResponsableService();

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
  this.router.get(this.path,validationMiddleware(FindResponsableDto) ,this.getResponsables);
  this.router.post(this.path,validationMiddleware(CreateResponsableDto), this.addResponsable);
  this.router.get(this.path + "/:id", this.getResponsable);
  //this.router.get(this.path + "/:id/assets", this.getResponsableAssets);
  this.router.patch(this.path + "/:id", validationMiddleware(UpdateResponsableDto), this.modifyResponsable);
  this.router.delete(this.path + "/:id", this.deleteResponsable);
    }

    private getResponsables = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const filters : FindResponsableDto[] = request.body;
            const responsables = await this.responsableService.getResponsables(filters, request.query.limit, request.query.offset);
            response.send(responsables);
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    }

    private addResponsable = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            var responsableData: CreateResponsableDto = request.body;
            const newResponsable = await this.responsableService.addResponsable(responsableData);
            response.send(newResponsable);
        } catch (error) {
            next(new HttpException(400, error.message))
        }
    }


    private modifyResponsable = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        if (!isNaN(parseInt(request.params.id))) {
            var responsableData: UpdateResponsableDto = request.body;
            if (Object.keys(responsableData).length == 0) {
                next(new HttpException(400, "There is not anything to update"))
            } else {
                try {
                    const responsable: Responsable = await this.responsableService.modifyResponsable(parseInt(request.params.id), responsableData);
                    if (responsable)
                        response.send(responsable);
                    else next(new HttpException(404, "Responsable does not exist"))
                } catch (error) {
                    next(new HttpException(400, error.message))
                }
            }
        } else {
            next(new HttpException(400, "Id has to be a number"))
        }
    }

    private getResponsable = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        if (!isNaN(parseInt(request.params.id))) {
            const responsable : Responsable = await this.responsableService.getResponsable(parseInt(request.params.id));
            if (responsable)
                response.send(responsable);
            else next(new HttpException(404, "Responsable does not exist"))
        } else {
            next(new HttpException(400, "Id has to be a number"))
        }
    }



    private deleteResponsable = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        if (!isNaN(parseInt(request.params.id))) {
            const result = await this.responsableService.deleteResponsable(parseInt(request.params.id));
            if (result.affected!=0)
                response.sendStatus(200);
            else next(new HttpException(404, "Responsable does not exist"))
        } else {
            next(new HttpException(400, "Id has to be a number"))
        }
    }


}

export default ResponsableController;
