import * as express from 'express';
import Controller from 'routes/interfaces/controller.interface';
import validationMiddleware from '../middleware/validation.middleware';
import permissionMiddleware from '../middleware/permission.middleware';
import { CreateAssetDto, UpdateAssetDto, FindAssetDto } from './asset.dto';
import { getRepository } from 'typeorm';
import AssetService from './asset.service';
import HttpException from '../exceptions/HTTPException';
import authMiddleware from '../middleware/auth.middleware';
import Asset from './asset.entity';
import * as jwt from 'jsonwebtoken';
import { modifyEntries, addCompanyFilter } from '../../utils/modifyEntries';
import DataStoredInToken from '../interfaces/dataStoredInToken.interface';



class AssetController implements Controller {
    public path = "/assets";
    public router = express.Router();
    private assetService = new AssetService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(this.path, authMiddleware, permissionMiddleware(["ADD ASSETS"]), validationMiddleware(CreateAssetDto), this.addAsset);
        this.router.all(this.path + "/*", authMiddleware);
        this.router.post(this.path + "/search", permissionMiddleware(["GET ASSETS"]), validationMiddleware(FindAssetDto), this.getAssets);
        this.router.get(this.path + "/:id/tags", permissionMiddleware(["GET ASSETS", "GET TAGS"]), this.getAssetTags)
        this.router.get(this.path + "/:id/integrations", permissionMiddleware(["GET ASSETS", "GET INTEGRATIONS"]), this.getAssetIntegrations)
        this.router.get(this.path + "/:id/audits", permissionMiddleware(["GET ASSETS", "GET AUDITS"]), this.getAssetAudits)
        this.router.get(this.path + "/:id/urls", permissionMiddleware(["GET ASSETS", "GET URLS"]), this.getAssetUrls)
        this.router.get(this.path + "/:id/groups", permissionMiddleware(["GET ASSETS", "GET GROUPS"]), this.getAssetGroups)
        this.router.get(this.path + "/:id", permissionMiddleware(["GET ASSETS"]), this.getAsset);
        this.router.patch(this.path + "/:id", permissionMiddleware(["MODIFY ASSETS"]), validationMiddleware(UpdateAssetDto), this.modifyAsset);
        this.router.delete(this.path + "/:id", permissionMiddleware(["DELETE ASSETS"]), this.deleteAsset);
    }

    private getAssetTags = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const asset: Asset = await this.findAsset(request, ["tags"]);
            if (asset)
                response.send(asset.tags);
            else next(new HttpException(404, "Asset does not exist"))
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    }
    private getAssetAudits = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const asset: Asset = await this.findAsset(request, ["audits"]);
            if (asset)
                response.send(asset.audits);
            else next(new HttpException(404, "Asset does not exist"))
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    }
    private getAssetIntegrations = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const asset: Asset = await this.findAsset(request, ["integrations"]);
            if (asset)
                response.send(asset.integrations);
            else next(new HttpException(404, "Asset does not exist"))
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    }
    private getAssetGroups = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const asset: Asset = await this.findAsset(request, ["groups"]);
            if (asset)
                response.send(asset.groups);
            else next(new HttpException(404, "Asset does not exist"))
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    }
    private getAssetUrls = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const asset: Asset = await this.findAsset(request, ["urls"]);
                if (asset)
                    response.send(asset.urls);
                else next(new HttpException(404, "Asset does not exist"))
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    }


    private findAsset = async (request: express.Request, relations) => {
        var filterCompanies = [];
        this.setFilters(request, filterCompanies)
        const asset: Asset = await this.assetService.getAsset(filterCompanies, relations);
        return asset;
    }


    private setFilters = (request: express.Request, filterCompanies) => {
        filterCompanies.push({ id: parseInt(request.params.id) });
        const secret = process.env.JWT_SECRET;
        const companies = (jwt.verify(request.header('xtoken'), secret) as DataStoredInToken).companies;
        addCompanyFilter(filterCompanies, companies);
    }
    /*private getAssetVulnerabilities = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        if (!isNaN(parseInt(request.params.id))) {
            const vulnerabilities : Vulnerability[] = await this.assetService.getAssetVulnerabilities(parseInt(request.params.id));
            if (vulnerabilities)
                response.send(vulnerabilities);
            else next(new HttpException(404, "Asset does not exist"))
        } else {
            next(new HttpException(400, "Id has to be a number"))
        }
    }*/
    private getAssets = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const secret = process.env.JWT_SECRET;
            const filters: FindAssetDto[] = request.body.length > 0 ? request.body : []
            modifyEntries(filters)
            const companies = (jwt.verify(request.header('xtoken'), secret) as DataStoredInToken).companies;
            addCompanyFilter(filters, companies)
            const assets = await this.assetService.getAssets(filters, request.query.limit, request.query.offset);
            response.send(assets);
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    }
    private addAsset = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const secret = process.env.JWT_SECRET;
            const companies = (jwt.verify(request.header('xtoken'), secret) as DataStoredInToken).companies;
            var assetData: CreateAssetDto = request.body;
            if (companies.indexOf(assetData.company.id) == -1) {
                next(new HttpException(400, "User does not belong to that company"))
            } else {
                const newAsset = await this.assetService.addAsset(assetData);
                response.status(201).send(newAsset);
            }
        } catch (error) {
            next(new HttpException(400, error.message))
        }
    }
    private modifyAsset = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        var assetData: UpdateAssetDto = request.body;
        try {
            var filterCompanies = [];
            this.setFilters(request, filterCompanies)
            const asset: Asset = await this.assetService.modifyAsset(filterCompanies, assetData);
            if (asset)
                response.send(asset);
            else next(new HttpException(404, "Asset does not exist"))
        } catch (error) {
            next(new HttpException(400, error.message));
        }

    }
    private getAsset = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const asset: Asset = await this.findAsset(request, ["audits", "tags", "groups", "integrations"]);
            if (asset)
                response.send(asset);
            else next(new HttpException(404, "Asset does not exist"))       
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    }
    private deleteAsset = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const asset: Asset = await this.findAsset(request, []);
                if (asset) {
                    const result = await this.assetService.deleteAsset(request.params.id);
                    response.status(200).send();
                }
                else next(new HttpException(404, "Asset does not exist"))
        } catch (error) {
            next(new HttpException(400, error.message));
        }    
    }
}

export default AssetController;
