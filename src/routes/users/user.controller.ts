import * as express from 'express';
import Controller from 'routes/interfaces/controller.interface';
import validationMiddleware from '../middleware/validation.middleware';
import permissionMiddleware from '../middleware/permission.middleware';
import { CreateUserDto, UpdateUserDto, FindUserDto } from './user.dto';
import User from '../../entities/user.entity';
import UserService from './user.service';
import HttpException from '../exceptions/HTTPException';
import authMiddleware from '../middleware/auth.middleware';
import * as bcrypt from 'bcrypt';
import Group from '../../entities/group.entity';
import Company from '../../entities/company.entity';
import Profile from '../../entities/profile.entity';
import { modifyEntries, addCompanyFilter } from '../../utils/modifyEntries';
import DataStoredInToken from 'routes/interfaces/dataStoredInToken.interface';
import * as jwt from 'jsonwebtoken';



class UserController implements Controller {
    public path = "/users";
    public router = express.Router();
    private userService = new UserService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(this.path,authMiddleware,permissionMiddleware(["ADD USERS"]),validationMiddleware(CreateUserDto), this.addUser);
        this.router.all(this.path+"/*",authMiddleware);
        this.router.post(this.path+"/search",permissionMiddleware(["GET USERS"]),validationMiddleware(FindUserDto),this.getUsers);
        this.router.get(this.path + "/:id",permissionMiddleware(["GET USERS"]), this.getUser);
        this.router.get(this.path + "/:id/groups",permissionMiddleware(["GET USERS","GET GROUPS"]),this.getUserGroups)
        this.router.get(this.path + "/:id/companies",permissionMiddleware(["GET COMPANIES"]),this.getUserCompanies)
        this.router.get(this.path + "/:id/profiles",permissionMiddleware(["GET USERS","GET PROFILES"]),this.getUserProfile)
        this.router.patch(this.path + "/:id",permissionMiddleware(["MODIFY USERS"]), validationMiddleware(UpdateUserDto), this.modifyUser);
        this.router.delete(this.path + "/:id",permissionMiddleware(["DELETE USERS"]) ,this.deleteUser);
    }

    private setFilters = (request: express.Request, filterCompanies) => {
        filterCompanies.push({ id: parseInt(request.params.id) });
        const secret = process.env.JWT_SECRET;
        const companies = (jwt.verify(request.header('xtoken'), secret) as DataStoredInToken).companies;
        addCompanyFilter(filterCompanies, companies);
    }
    private findUser = async (request: express.Request, relations) => {
        var filterCompanies = [];
        this.setFilters(request, filterCompanies)
        const user: User = await this.userService.getUser(filterCompanies, relations);
        return user;
    }

    private getUsers = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const secret = process.env.JWT_SECRET;
            const companies = (jwt.verify(request.header('xtoken'), secret) as DataStoredInToken).companies;
            const filters : FindUserDto[] = request.body.length > 0 ? request.body : []
            modifyEntries(filters)
            addCompanyFilter(filters, companies)
            const users = await this.userService.getUsers(filters, request.query.limit, request.query.offset);            
            response.status(200).send(users);
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    }

    private addUser = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            var userData: CreateUserDto = request.body;
            userData.password =  await bcrypt.hash(userData.password,10);
            const newUser = await this.userService.addUser(userData);
            delete newUser.password;
            response.status(201).send(newUser);
        } catch (error) {
            next(new HttpException(400, error.message))
        }
    }

    private getUserGroups = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const user : User = await this.findUser(request,["groups"]);
            if (user)
                response.send(user.groups);
            else next(new HttpException(404, "User does not exist"))
        } catch (error) {
            next(new HttpException(400, error.message))
        }
    }

    private getUserProfile = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const user : User = await this.findUser(request,["profile"]);
            if (user)
                response.send(user.profile);
            else next(new HttpException(404, "User does not exist"))
        } catch (error) {
            next(new HttpException(400, error.message))
        }
    }

    private getUserCompanies = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const user : User = await this.findUser(request,["companies"]);
            if (user)
                response.send(user.companies);
            else next(new HttpException(404, "User does not exist"))
        } catch (error) {
            next(new HttpException(400, error.message))
        }
    }


    private modifyUser = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        var userData: UpdateUserDto = request.body;
        try {
            if (Object.keys(userData).length == 0) {
                next(new HttpException(400, "There is not anything to update"))
            } else {
                try {
                    if(userData.password)
                        userData.password =  await bcrypt.hash(userData.password,10);
                    const user: User = await this.userService.modifyUser(parseInt(request.params.id), userData);
                    if (user)
                        response.send(user);
                    else next(new HttpException(404, "User does not exist"))
                } catch (error) {
                    next(new HttpException(400, error.message))
                }
            }
        } catch (error) {
            next(new HttpException(400, error.message))
        }
        
    }

    private getUser = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const user: User = await this.findUser(request,["companies","profile"]);
                if (user)
                    response.send(user);
                else next(new HttpException(404, "User does not exist"))
        } catch (error) {
            next(new HttpException(400, error.message))
        }
        
    }

    private deleteUser = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        if (!isNaN(parseInt(request.params.id))) {
            const result = await this.userService.deleteUser(parseInt(request.params.id));
            if (result.affected!=0)
                response.status(200).send();
            else next(new HttpException(404, "User does not exist"))
        } else {
            next(new HttpException(400, "Id has to be a number"))
        }
    }


}

export default UserController;
