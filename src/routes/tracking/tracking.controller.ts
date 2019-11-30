import * as express from 'express';
import Controller from 'routes/interfaces/controller.interface';
import validationMiddleware from '../middleware/validation.middleware';
import permissionMiddleware from '../middleware/permission.middleware';
import TrackingService from './tracking.service';
import HttpException from '../exceptions/HTTPException';
import * as jwt from 'jsonwebtoken';
import { modifyEntries, addCompanyFilter } from '../../utils/modifyEntries';
import DataStoredInToken from '../interfaces/dataStoredInToken.interface';
import authMiddleware from '../middleware/auth.middleware';
import { VulnerabilityStatus } from '../../utils/constants';
import * as moment from 'moment';
import { CreateTrackingDto } from './tracking.dto';

class TrackingController implements Controller {
    public path = "/tracking";
    public router = express.Router();
    private trackingService = new TrackingService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(this.path+"/webhook/*", this.webhookHandler);
        this.router.post(this.path+"/test", this.test);
 //       this.router.all(this.path + "/*", authMiddleware);
    }
    private test = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            let tracking: CreateTrackingDto
            console.log('hasta aqui')
            const trackingService = await this.trackingService.addTracking(tracking)
            console.log('hasta aqui2')
            // tracking.key = "HAC"

            response.send();
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    }
    // private setFilters = (request: express.Request, filterCompanies) => {
    //     filterCompanies.push({ id: parseInt(request.params.id) });
    //     const secret = process.env.JWT_SECRET;
    //     const companies = (jwt.verify(request.header('xtoken'), secret) as DataStoredInToken).companies;
    //     addCompanyFilter(filterCompanies, companies);
    //}
    private webhookHandler = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            console.log(request.url, request.query, request.body)
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    }
}

export default TrackingController;
