import * as express from 'express';
import Controller from 'routes/interfaces/controller.interface';
import validationMiddleware from '../middleware/validation.middleware';
import permissionMiddleware from '../middleware/permission.middleware';
import Profile from '../../entities/profile.entity';
import   ProfileService  from './profile.service';
import HttpException from '../exceptions/HTTPException';
import authMiddleware from '../middleware/auth.middleware';
import { CreateProfileDto, UpdateProfileDto, FindProfileDto } from './profile.dto';
import { modifyEntries } from '../../utils/modifyEntries';



class ProfileController implements Controller {
    public path = "/profiles";
    public router = express.Router();
    private profileService = new ProfileService();


    constructor(){
        this.initializeRoutes();
    }

    private initializeRoutes(){
        this.router.post(this.path,authMiddleware,permissionMiddleware(["ADD PROFILES"]), validationMiddleware(CreateProfileDto), this.addProfile);
        this.router.all(this.path+"/*",authMiddleware);
        this.router.post(this.path+"/search",permissionMiddleware(["GET PROFILES"]),validationMiddleware(FindProfileDto),this.getProfiles);
        this.router.get(this.path + "/:id",permissionMiddleware(["GET PROFILES"]), this.getProfile);
        this.router.patch(this.path + "/:id",permissionMiddleware(["MODIFY PROFILES"]), validationMiddleware(UpdateProfileDto),this.modifyProfile);
        this.router.delete(this.path + "/:id",permissionMiddleware(["DELETE PROFILES"]), this.deleteProfile);
    }


    private getProfiles = async (request: express.Request, response: express.Response, next : express.NextFunction) => {
        try {
            const filters : FindProfileDto[] = request.body
            modifyEntries(filters)
            const profiles = await this.profileService.getProfiles(filters, request.query.limit, request.query.offset);
            response.status(200).send(profiles);
        } catch (error) {
            next(new HttpException(400,error.message));
        }
    }

    private addProfile = async (request: express.Request, response: express.Response, next : express.NextFunction) => {
        try {
            const profileData: CreateProfileDto = request.body;
            const newProfile = await this.profileService.addProfile(profileData);
            response.send(newProfile);
        } catch (error) {
            next(new HttpException(400,error.message));
        }
    }

    
    private modifyProfile = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const profileData: UpdateProfileDto = request.body;
            const profile : Profile = await this.profileService.modifyProfile(request.params.id, profileData);
            if (profile)
                response.status(201).send(profile);
            else next(new HttpException(404, "Profile does not exist"))            
        } catch (error) {
            next(new HttpException(400, error.message))
        }
    }

    private getProfile = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const profile : Profile = await this.profileService.getProfile(parseInt(request.params.id));
                if (profile)
                    response.send(profile);
                else next(new HttpException(404, "Profile does not exist"))
        } catch (error) {
            next(new HttpException(400, error.message))
        }
    }

    private deleteProfile = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const result = await this.profileService.deleteProfile(parseInt(request.params.id));
                if (result.affected)
                    response.status(200).send();
                else next(new HttpException(404, "Profile does not exist"))
        } catch (error) {
            next(new HttpException(400, error.message))
        }
    }
}

export default ProfileController;
