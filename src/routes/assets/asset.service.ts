import { getRepository } from 'typeorm';
import { CreateAssetDto, UpdateAssetDto, FindAssetDto } from './asset.dto';
import Asset from './asset.entity';



class AssetService {
    private assetRepository = getRepository(Asset)


    public addAsset = async (assetData: CreateAssetDto) => {
        try {
            const asset = await this.assetRepository.save(assetData);
            return (asset);
        } catch (error) {
            switch (error.code) {
                case "42601":
                    throw new Error("Syntax error")
                case "23503":
                    throw new Error("Reference is missing")
                case "23505":
                    throw new Error("Asset already exist")
                default:
                    throw new Error("Unknown error");
            }
        }
    }
    public getAsset = async (filters, relations) => {
        try {
            const asset = await this.assetRepository.findOne({ where: filters, relations: relations });
            return (asset);
        } catch (error) {
            switch (error.code) {
                case "42601":
                    throw new Error("Syntax error")
                case "23503":
                    throw new Error("Reference is missing")
                default:
                    throw new Error("Unknown error");
            }
        }
    }
    public getAssetTags = async (id: number) => {
        try {
            const asset = await this.assetRepository.findOne({ where: { id: id }, relations: ["tags"] });
            if (asset) {
                return (asset.tags);
            } else return (null)
        } catch (error) {
            switch (error.code) {
                case "42601":
                    throw new Error("Syntax error")
                case "23503":
                    throw new Error("Reference is missing")
                default:
                    throw new Error("Unknown error");
            }
        }
    }
    /*public getAssetVulnerabilities = async (id: number) => {
        const asset = await this.assetRepository.findOne({ where: {id : id}, select : ["audits"], relations : ["audits.vulnerabilities"]});
        if(asset){
            return (asset.audits);
        }else return (null)
    }*/
    public getAssetIntegrations = async (id: number) => {
        try {
            const asset = await this.assetRepository.findOne({ where: { id: id }, relations: ["integrations"] });
            if (asset) {
                return (asset.integrations);
            } else return (null)
        } catch (error) {
            switch (error.code) {
                case "42601":
                    throw new Error("Syntax error")
                case "23503":
                    throw new Error("Reference is missing")
                default:
                    throw new Error("Unknown error");
            }
        }
    }
    public getAssetAudits = async (id: number) => {
        try {
            const asset = await this.assetRepository.findOne({ where: { id: id }, relations: ["audits"] });
            if (asset) {
                return (asset.audits);
            } else return (null)
        } catch (error) {
            switch (error.code) {
                case "42601":
                    throw new Error("Syntax error")
                case "23503":
                    throw new Error("Reference is missing")
                default:
                    throw new Error("Unknown error");
            }
        }
    }
    public getAssetUrls = async (id: number) => {
        try {
            const asset = await this.assetRepository.findOne({ where: { id: id }, relations: ["urls"] });
            if (asset) {
                return (asset.urls);
            } else return (null)
        } catch (error) {
            switch (error.code) {
                case "42601":
                    throw new Error("Syntax error")
                case "23503":
                    throw new Error("Reference is missing")
                default:
                    throw new Error("Unknown error");
            }
        }
    }
    public getAssets = async (filters, limit, offset) => {
        try {
            const assets = await this.assetRepository.findAndCount({ where: filters, relations: ["company", "businessArea", "department", "audits", "integrations"] })
            return (assets);
        } catch (error) {
            switch (error.code) {
                case "42601":
                    throw new Error("Syntax error")
                case "23503":
                    throw new Error("Reference is missing")
                default:
                    console.log(error)
                    throw new Error("Unknown error");
            }
        }
    }
    public modifyAsset = async (filters, assetData: UpdateAssetDto) => {
        try {
            var asset: Asset = await this.assetRepository.findOne({ where: filters });
            if (asset) {
                const updatedAsset = await this.assetRepository.save(Object.assign(asset, assetData));
                return (updatedAsset);
            } else {
                return (null)
            }
        } catch (error) {
            switch (error.code) {
                case "23503":
                    throw new Error("Reference is missing")
                default:
                    throw new Error("Unknown error");
            }
        }
    }
    public deleteAsset = async (id) => {
        try {
            const deletedAsset = await this.assetRepository.delete(id);
            return (deletedAsset);
        } catch (error) {
            switch (error.code) {
                case "42601":
                        throw new Error("Syntax error")
                default:
                    throw new Error("Unknown error");
            }
        }
    }
}


export default AssetService;
