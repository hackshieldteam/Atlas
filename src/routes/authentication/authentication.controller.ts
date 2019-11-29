import * as bcrypt from 'bcrypt';
import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import UserAlreadyExistsException from '../exceptions/UserAlreadyExistsException';
import WrongCredentialsException from '../exceptions/WrongCredentialsException';
import Controller from '../interfaces/controller.interface';
import UserService from '../users/user.service';
import validationMiddleware from '../middleware/validation.middleware';
import { CreateUserDto } from '../users/user.dto';
import LogInDto from './logIn.dto';
import { request } from 'http';
import User from 'entities/user.entity';
import TokenData from '../interfaces/tokendata.interface';
import DataStoredInToken from '../interfaces/dataStoredInToken.interface';
import ProfileService from '../profiles/profile.service';
import Profile from '../../entities/profile.entity';
import Functionality from '../../entities/functionality.entity';
import Company from '../../entities/company.entity';
import CompanyService from '../companies/company.service';
import Group from 'entities/group.entity';


class AuthenticationController implements Controller{
    public path = "/auth"
    public router = express.Router();
    private userService = new UserService();
    private profileService = new ProfileService();
    private companyService = new CompanyService();

    constructor(){
        this.initializeRoutes()
    }


    private createToken( user : User, functionalities : string[],groups : Group[], companies : Company[]) : TokenData{
        const expiresIn = parseInt(process.env.TOKEN_DURATION);
        const secret = process.env.JWT_SECRET;
        var groupIds = [];
        var companyIds = [];
        
        groups.forEach(function(group){
            groupIds.push(group.id)
        });

        companies.forEach(function(company){
            companyIds.push(company.id)
        });

        const dataStoredInToken: DataStoredInToken = {
            id: user.id,
            functionalities : functionalities,
            groups : groupIds,
            companies : companyIds
          };
          return {
            expiresIn,
            token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
          };

    }

    private initializeRoutes(){
        this.router.post(`${this.path}`+"/register",validationMiddleware(CreateUserDto),this.registration);
        this.router.post(`${this.path}`+"/login",validationMiddleware(LogInDto),this.loggingIn)
    }

    private registration = async ( request : express.Request, response : express.Response, next : express.NextFunction) =>{
        var userData : CreateUserDto = request.body;
        if( await this.userService.getUserByUsername(userData.name)){
            next(new UserAlreadyExistsException(userData.name))
        }else{
            const hashedPassword = await bcrypt.hash(userData.password,10);
            userData.password = hashedPassword;
            const user = await this.userService.addUser(userData)
            //user.password = undefined;
            response.send(user)
        }
    }

    private loggingIn = async ( request : express.Request, response : express.Response, next : express.NextFunction) =>{
        const logInData : LogInDto = request.body;
        const user = await this.userService.getUserByUsername(logInData.name);
        if(user){
            const isPasswordMatching = await bcrypt.compare(logInData.password,user.password);
            if(isPasswordMatching){
                const profile : Profile = user.profile;
                const groups : Group[] = user.groups;
                const companies : Company[] = user.companies;
                var functionalities : string[] = [];
                profile.functionalities.forEach(function(functionality){
                    functionalities.push(functionality.name)
                })
                const tokendata = this.createToken(user,functionalities,groups,companies);
                var token = [this.createCookie(tokendata)]
                
                response.send({token : tokendata.token});
            }else{
                next(new WrongCredentialsException())    
            }
        }else{
            next(new WrongCredentialsException())
        }
    }


    private createCookie(tokenData: TokenData) {
        return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
      }
}

export default AuthenticationController;
