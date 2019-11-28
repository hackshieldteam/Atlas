import * as express from 'express';
import Controller from 'routes/interfaces/controller.interface';
import validationMiddleware from '../middleware/validation.middleware';
import permissionMiddleware from '../middleware/permission.middleware';
import { CreateUrlDto, UpdateUrlDto, FindUrlDto } from './url.dto';
import UrlService from './url.service';
import HttpException from '../exceptions/HTTPException';
import Url from './url.entity';
import Department from '../departments/department.entity';
import Asset from '../assets/asset.entity';



class UrlController implements Controller {
    public path = "/urls";
    public router = express.Router();
    private urlService = new UrlService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
/*        this.router.get(this.path,authMiddleware,permissionMiddleware(["GET AREAS"]),this.getUrls);
        this.router.post(this.path,/*authMiddleware ,permissionMiddleware(["ADD AREAS"]),validationMiddleware(CreateUrlDto), this.addUrl);
        this.router.all(this.path + "/*", authMiddleware);
        this.router.get(this.path + "/:id",permissionMiddleware(["GET AREAS"]), this.getUrl);
        this.router.get(this.path + "/:id/departments",permissionMiddleware(["GET AREAS","GET DEPARTMENTS"]), this.getUrlDepartments);
        this.router.get(this.path + "/:id/assets",permissionMiddleware(["GET AREAS","GET ASSETS"]), this.getUrlAssets);
        this.router.patch(this.path + "/:id",permissionMiddleware(["MODIFY AREAS"]), validationMiddleware(UpdateUrlDto), this.modifyUrl);
        this.router.delete(this.path + "/:id",permissionMiddleware(["DELETE AREAS"]), this.deleteUrl);
   */
  this.router.get(this.path,validationMiddleware(FindUrlDto),this.getUrls);
  this.router.post(this.path,validationMiddleware(CreateUrlDto), this.addUrl);
  this.router.get(this.path + "/:id", this.getUrl);
  this.router.patch(this.path + "/:id", validationMiddleware(UpdateUrlDto), this.modifyUrl);
  this.router.delete(this.path + "/:id", this.deleteUrl);
    }

    private getUrls = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const filters : FindUrlDto[] = request.body;
            const urls = await this.urlService.getUrls(filters, request.query.limit, request.query.offset);
            response.send(urls);
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    }

    private addUrl = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            var urlData: CreateUrlDto = request.body;
            const newUrl = await this.urlService.addUrl(urlData);
            response.send(newUrl);
        } catch (error) {
            next(new HttpException(400, error.message))
        }
    }


    private modifyUrl = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        if (!isNaN(parseInt(request.params.id))) {
            var urlData: UpdateUrlDto = request.body;
            if (Object.keys(urlData).length == 0) {
                next(new HttpException(400, "There is not anything to update"))
            } else {
                try {
                    const url: Url = await this.urlService.modifyUrl(parseInt(request.params.id), urlData);
                    if (url)
                        response.send(url);
                    else next(new HttpException(404, "Url does not exist"))
                } catch (error) {
                    next(new HttpException(400, error.message))
                }
            }
        } else {
            next(new HttpException(400, "Id has to be a number"))
        }
    }

    private getUrl = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        if (!isNaN(parseInt(request.params.id))) {
            const url : Url = await this.urlService.getUrl(parseInt(request.params.id));
            if (url)
                response.send(url);
            else next(new HttpException(404, "Url does not exist"))
        } else {
            next(new HttpException(400, "Id has to be a number"))
        }
    }



    private deleteUrl = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        if (!isNaN(parseInt(request.params.id))) {
            const result = await this.urlService.deleteUrl(parseInt(request.params.id));
            if (result.affected!=0)
                response.sendStatus(200);
            else next(new HttpException(404, "Url does not exist"))
        } else {
            next(new HttpException(400, "Id has to be a number"))
        }
    }


}

export default UrlController;
