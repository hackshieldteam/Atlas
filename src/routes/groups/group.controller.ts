import * as express from 'express';
import Controller from 'routes/interfaces/controller.interface';
import validationMiddleware from '../middleware/validation.middleware';
import permissionMiddleware from '../middleware/permission.middleware';
import HttpException from '../exceptions/HTTPException';
import authMiddleware from '../middleware/auth.middleware';
import { CreateGroupDto, UpdateGroupDto, FindGroupDto } from './group.dto';
import GroupService from './group.service';
import Group from '../../entities/group.entity';
import Asset from 'entities/asset.entity';
import User from 'entities/user.entity';
import * as jwt from 'jsonwebtoken';
import { modifyEntries, addCompanyFilter } from '../../utils/modifyEntries';
import DataStoredInToken from '../interfaces/dataStoredInToken.interface';
import { In, Like } from 'typeorm';




class GroupController implements Controller {
    public path = "/groups";
    public router = express.Router();
    private groupService = new GroupService();


    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(this.path+"/search", authMiddleware, permissionMiddleware(["GET GROUPS"]), this.getGroups);
        this.router.post(this.path, authMiddleware, permissionMiddleware(["ADD GROUPS"]), validationMiddleware(CreateGroupDto), this.addGroup);
        this.router.all(this.path + "/*", authMiddleware);
        this.router.get(this.path + "/:id/assets", permissionMiddleware(["GET GROUPS", "GET ASSETS"]), this.getGroupAssets);
        this.router.get(this.path + "/:id/users", permissionMiddleware(["GET GROUPS", "GET USERS"]), this.getGroupUsers);
        this.router.get(this.path + "/:id", permissionMiddleware(["GET GROUPS"]), this.getGroup);
        this.router.patch(this.path + "/:id", permissionMiddleware(["MODIFY GROUPS"]), validationMiddleware(UpdateGroupDto), this.modifyGroup);
        this.router.delete(this.path + "/:id", permissionMiddleware(["DELETE GROUPS"]), this.deleteGroup);
    }


    private getGroups = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const secret = process.env.JWT_SECRET;
            const filters: FindGroupDto[] = request.body.length > 0 ? request.body : []
            modifyEntries(filters)
            const companies = (jwt.verify(request.header('xtoken'), secret) as DataStoredInToken).companies;
            addCompanyFilter(filters, companies)
            const groups = await this.groupService.getGroups(filters, request.query.limit, request.query.offset);
            response.send(groups);
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    }
    private addGroup = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const secret = process.env.JWT_SECRET;
            const companies = (jwt.verify(request.header('xtoken'), secret) as DataStoredInToken).companies;
            const groupData: CreateGroupDto = request.body;
            if (companies.indexOf(groupData.company.id) == -1) {
                next(new HttpException(400, "User does not belong to that company"))
            } else {
                const newGroup = await this.groupService.addGroup(groupData);
                response.status(201).send(newGroup);
            }
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    }
    private modifyGroup = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const groupData: UpdateGroupDto = request.body;
        try {
            var filterCompanies = [];
            this.setFilters(request, filterCompanies)
            const group: Group = await this.groupService.modifyGroup(filterCompanies, groupData);
            if (group)
                response.send(group);
            else next(new HttpException(404, "Group does not exist"))
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
    private findGroup = async (request: express.Request, relations) => {
        var filterCompanies = [];
        this.setFilters(request, filterCompanies)
        const group: Group = await this.groupService.getGroup(filterCompanies, relations);
        return group;
    }
    private getGroup = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        if (!isNaN(parseInt(request.params.id))) {
            const group: Group = await this.findGroup(request, ["users", "assets", "tags", "company"]);
            if (group)
                response.send(group);
            else next(new HttpException(404, "Group does not exist"))
        } else {
            next(new HttpException(400, "Id has to be a number"))
        }
    }
    private getGroupAssets = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        if (!isNaN(parseInt(request.params.id))) {
            const group: Group = await this.findGroup(request, ["assets"]);
            if (group)
                response.send(group.assets);
            else next(new HttpException(404, "Group does not exist"))
        } else {
            next(new HttpException(400, "Id has to be a number"))
        }
    }
    private getGroupUsers = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        if (!isNaN(parseInt(request.params.id))) {
            const group: Group = await this.findGroup(request, ["users"]);
            if (group)
                response.send(group.users);
            else next(new HttpException(404, "Group does not exist"))
        } else {
            next(new HttpException(400, "Id has to be a number"))
        }
    }
    private getGroupTags = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        if (!isNaN(parseInt(request.params.id))) {
            const group: Group = await this.findGroup(request, ["tags"]);
            if (group)
                response.send(group.tags);
            else next(new HttpException(404, "Group does not exist"))
        } else {
            next(new HttpException(400, "Id has to be a number"))
        }
    }
    private deleteGroup = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        if (!isNaN(parseInt(request.params.id))) {
            const group: Group = await this.findGroup(request, []);
            if (group) {
                const result = await this.groupService.deleteGroup(request.params.id);
                response.sendStatus(200);
            } else {
                next(new HttpException(404, "Group does not exist"))
            }
        } else {
            next(new HttpException(400, "Id has to be a number"))
        }
    }
}

export default GroupController;
