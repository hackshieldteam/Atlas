import * as express from 'express';
import Controller from 'routes/interfaces/controller.interface';
import validationMiddleware from '../middleware/validation.middleware';
import permissionMiddleware from '../middleware/permission.middleware';
import { CreateIntegrationDto, UpdateIntegrationDto, FindIntegrationDto } from './integration.dto';
import IntegrationService from './integration.service';
import HttpException from '../exceptions/HTTPException';
import authMiddleware from '../middleware/auth.middleware';
import Integration from '../../entities/integration.entity';



class IntegrationController implements Controller {
    public path = "/integrations";
    public router = express.Router();
    private integrationService = new IntegrationService();

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
  this.router.get(this.path,validationMiddleware(FindIntegrationDto),this.getIntegrations);
  this.router.post(this.path,validationMiddleware(CreateIntegrationDto), this.addIntegration);
  this.router.get(this.path + "/:id", this.getIntegration);
  this.router.patch(this.path + "/:id", validationMiddleware(UpdateIntegrationDto), this.modifyIntegration);
  this.router.delete(this.path + "/:id", this.deleteIntegration);
    }

    private getIntegrations = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const filters : FindIntegrationDto[] = request.body;
            const integrations = await this.integrationService.getIntegrations(filters, request.query.limit, request.query.offset);
            response.send(integrations);
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    }

    private addIntegration = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            var integrationData: CreateIntegrationDto = request.body;
            const newIntegration = await this.integrationService.addIntegration(integrationData);
            response.send(newIntegration);
        } catch (error) {
            next(new HttpException(400, error.message))
        }
    }


    private modifyIntegration = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        if (!isNaN(parseInt(request.params.id))) {
            var integrationData: UpdateIntegrationDto = request.body;
                try {
                    const integration: Integration = await this.integrationService.modifyIntegration(parseInt(request.params.id), integrationData);
                    if (integration)
                        response.status(204).send(integration);
                    else next(new HttpException(404, "Integration does not exist"))
                } catch (error) {
                    next(new HttpException(400, error.message))
                }
        } else {
            next(new HttpException(400, "Id has to be a number"))
        }
    }

    private getIntegration = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        if (!isNaN(parseInt(request.params.id))) {
            const integration : Integration = await this.integrationService.getIntegration(parseInt(request.params.id));
            if (integration)
                response.send(integration);
            else next(new HttpException(404, "Integration does not exist"))
        } else {
            next(new HttpException(400, "Id has to be a number"))
        }
    }



    private deleteIntegration = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        if (!isNaN(parseInt(request.params.id))) {
            const result = await this.integrationService.deleteIntegration(parseInt(request.params.id));
            if (result.affected!=0)
                response.sendStatus(200);
            else next(new HttpException(404, "Integration does not exist"))
        } else {
            next(new HttpException(400, "Id has to be a number"))
        }
    }


}

export default IntegrationController;
