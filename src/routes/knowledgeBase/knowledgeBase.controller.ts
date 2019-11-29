import * as express from 'express';
import Controller from 'routes/interfaces/controller.interface';
import validationMiddleware from '../middleware/validation.middleware';
import permissionMiddleware from '../middleware/permission.middleware';
import KnowledgeBase from '../../entities/knowledgeBase.entity';
import HttpException from '../exceptions/HTTPException';
import authMiddleware from '../middleware/auth.middleware';
import { modifyEntries } from '../../utils/modifyEntries';
import { CreateKnowledgeDto, FindKnowledgeDto, UpdateKnowledgeDto } from './knowledgeBase.dto';
import KnowledgeBaseService from './knowledgeBase.service';



class KnowledgeBaseController implements Controller {
    public path = "/knowledgeBases";
    public router = express.Router();
    private knowledgeBaseService = new KnowledgeBaseService();


    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(this.path, authMiddleware, permissionMiddleware(["ADD KNOWLEDGE"]), validationMiddleware(CreateKnowledgeDto), this.addKnowledgeBase);
        this.router.all(this.path + "/*", authMiddleware);
        this.router.post(this.path + "/search", permissionMiddleware(["GET KNOWLEDGE"]), validationMiddleware(FindKnowledgeDto), this.getKnowledgeBases);
        this.router.get(this.path + "/:id", permissionMiddleware(["GET KNOWLEDGE"]), this.getKnowledgeBase);
        this.router.patch(this.path + "/:id", permissionMiddleware(["MODIFY KNOWLEDGE"]), validationMiddleware(UpdateKnowledgeDto), this.modifyKnowledgeBase);
        this.router.delete(this.path + "/:id", permissionMiddleware(["DELETE KNOWLEDGE"]), this.deleteKnowledgeBase);
    }


    private getKnowledgeBases = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const filters: FindKnowledgeDto = request.body
            modifyEntries(filters)
            const knowledgeBases = await this.knowledgeBaseService.getKnowledgeBases(filters, request.query.limit, request.query.offset);
            response.status(200).send(knowledgeBases);
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    }

    private addKnowledgeBase = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const knowledgeBaseData: CreateKnowledgeDto = request.body;
            const newKnowledgeBase = await this.knowledgeBaseService.addKnowledgeBase(knowledgeBaseData);
            response.send(newKnowledgeBase);
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    }


    private modifyKnowledgeBase = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const knowledgeBaseData: UpdateKnowledgeDto = request.body;
            const knowledgeBase: KnowledgeBase = await this.knowledgeBaseService.modifyKnowledgeBase(request.params.id, knowledgeBaseData);
            if (knowledgeBase)
                response.status(201).send(knowledgeBase);
            else next(new HttpException(404, "KnowledgeBase does not exist"))
        } catch (error) {
            next(new HttpException(400, error.message))
        }
    }

    private getKnowledgeBase = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const knowledgeBase: KnowledgeBase = await this.knowledgeBaseService.getKnowledgeBase(parseInt(request.params.id));
            if (knowledgeBase)
                response.send(knowledgeBase);
            else next(new HttpException(404, "KnowledgeBase does not exist"))
        } catch (error) {
            next(new HttpException(400, error.message))
        }
    }

    private deleteKnowledgeBase = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const result = await this.knowledgeBaseService.deleteKnowledgeBase(parseInt(request.params.id));
            if (result.affected)
                response.status(200).send();
            else next(new HttpException(404, "KnowledgeBase does not exist"))
        } catch (error) {
            next(new HttpException(400, error.message))
        }
    }
}

export default KnowledgeBaseController;
