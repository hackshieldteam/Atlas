import * as express from 'express';
import Controller from 'routes/interfaces/controller.interface';
import validationMiddleware from '../middleware/validation.middleware';
import permissionMiddleware from '../middleware/permission.middleware';
import { CreateTagDto, UpdateTagDto, FindTagDto } from './tag.dto';
import TagService from './tag.service';
import HttpException from '../exceptions/HTTPException';
import authMiddleware from '../middleware/auth.middleware';
import Tag from '../../entities/tag.entity';
import Asset from '../../entities/asset.entity';



class TagController implements Controller {
    public path = "/tags";
    public router = express.Router();
    private tagService = new TagService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
/*        this.router.get(this.path,authMiddleware,permissionMiddleware(["GET AREAS"]),this.getTags);
        this.router.post(this.path,/*authMiddleware ,permissionMiddleware(["ADD AREAS"]),validationMiddleware(CreateTagDto), this.addTag);
        this.router.all(this.path + "/*", authMiddleware);
        this.router.get(this.path + "/:id",permissionMiddleware(["GET AREAS"]), this.getTag);
        this.router.get(this.path + "/:id/departments",permissionMiddleware(["GET AREAS","GET DEPARTMENTS"]), this.getTagDepartments);
        this.router.get(this.path + "/:id/assets",permissionMiddleware(["GET AREAS","GET ASSETS"]), this.getTagAssets);
        this.router.patch(this.path + "/:id",permissionMiddleware(["MODIFY AREAS"]), validationMiddleware(UpdateTagDto), this.modifyTag);
        this.router.delete(this.path + "/:id",permissionMiddleware(["DELETE AREAS"]), this.deleteTag);
   */
  this.router.get(this.path,validationMiddleware(FindTagDto),this.getTags);
  this.router.post(this.path,validationMiddleware(CreateTagDto), this.addTag);
  this.router.get(this.path + "/:id", this.getTag);
  this.router.get(this.path + "/:id/assets", this.getTagAssets);
  this.router.patch(this.path + "/:id", validationMiddleware(UpdateTagDto), this.modifyTag);
  this.router.delete(this.path + "/:id", this.deleteTag);
    }

    private getTags = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const filters : FindTagDto[] = request.body;
            const tags = await this.tagService.getTags(filters, request.query.limit, request.query.offset);
            response.send(tags);
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    }

    private addTag = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            var tagData: CreateTagDto = request.body;
            const newTag = await this.tagService.addTag(tagData);
            response.send(newTag);
        } catch (error) {
            next(new HttpException(400, error.message))
        }
    }


    private modifyTag = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        if (!isNaN(parseInt(request.params.id))) {
            var tagData: UpdateTagDto = request.body;
            if (Object.keys(tagData).length == 0) {
                next(new HttpException(400, "There is not anything to update"))
            } else {
                try {
                    const tag: Tag = await this.tagService.modifyTag(parseInt(request.params.id), tagData);
                    if (tag)
                        response.send(tag);
                    else next(new HttpException(404, "Tag does not exist"))
                } catch (error) {
                    next(new HttpException(400, error.message))
                }
            }
        } else {
            next(new HttpException(400, "Id has to be a number"))
        }
    }

    private getTag = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        if (!isNaN(parseInt(request.params.id))) {
            const tag : Tag = await this.tagService.getTag(parseInt(request.params.id));
            if (tag)
                response.send(tag);
            else next(new HttpException(404, "Tag does not exist"))
        } else {
            next(new HttpException(400, "Id has to be a number"))
        }
    }




    private getTagAssets = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        if (!isNaN(parseInt(request.params.id))) {
            const assets : Asset[] = await this.tagService.getTagAssets(parseInt(request.params.id));
            if (assets)
                response.send(assets);
            else next(new HttpException(404, "Tag does not exist"))
        } else {
            next(new HttpException(400, "Id has to be a number"))
        }
    }

    private deleteTag = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        if (!isNaN(parseInt(request.params.id))) {
            const result = await this.tagService.deleteTag(parseInt(request.params.id));
            if (result.affected!=0)
                response.sendStatus(200);
            else next(new HttpException(404, "Tag does not exist"))
        } else {
            next(new HttpException(400, "Id has to be a number"))
        }
    }


}

export default TagController;
